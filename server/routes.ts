
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import * as cheerio from "cheerio";

// Helper to fetch HTML
async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0; +http://example.com/bot)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }
  
  return await response.text();
}

// Helper to analyze SEO
function analyzeSeo(url: string, html: string) {
  const $ = cheerio.load(html);
  
  const meta = {
    title: $('title').text().trim() || null,
    description: $('meta[name="description"]').attr('content') || null,
    canonical: $('link[rel="canonical"]').attr('href') || null,
    robots: $('meta[name="robots"]').attr('content') || null,
    keywords: $('meta[name="keywords"]').attr('content') || null,
    author: $('meta[name="author"]').attr('content') || null,
    
    // OG
    ogTitle: $('meta[property="og:title"]').attr('content') || null,
    ogDescription: $('meta[property="og:description"]').attr('content') || null,
    ogImage: $('meta[property="og:image"]').attr('content') || null,
    ogUrl: $('meta[property="og:url"]').attr('content') || null,
    ogType: $('meta[property="og:type"]').attr('content') || null,
    ogSiteName: $('meta[property="og:site_name"]').attr('content') || null,

    // Twitter
    twitterCard: $('meta[name="twitter:card"]').attr('content') || null,
    twitterTitle: $('meta[name="twitter:title"]').attr('content') || null,
    twitterDescription: $('meta[name="twitter:description"]').attr('content') || null,
    twitterImage: $('meta[name="twitter:image"]').attr('content') || null,
    twitterCreator: $('meta[name="twitter:creator"]').attr('content') || null,
    twitterSite: $('meta[name="twitter:site"]').attr('content') || null,
    
    raw: {} as Record<string, string>
  };

  // Collect all meta tags for raw view
  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('property');
    const content = $(el).attr('content');
    if (name && content) {
      meta.raw[name] = content;
    }
  });

  const issues: import('@shared/schema').SeoIssue[] = [];

  // 1. Title Checks
  if (!meta.title) {
    issues.push({ level: 'critical', message: 'Missing <title> tag.' });
  } else {
    if (meta.title.length < 10) issues.push({ level: 'warning', message: 'Title is too short (< 10 chars). Good titles are descriptive.' });
    if (meta.title.length > 60) issues.push({ level: 'warning', message: `Title is too long (${meta.title.length} chars). Google typically truncates after 60 chars.` });
    issues.push({ level: 'success', message: 'Title tag is present.' });
  }

  // 2. Description Checks
  if (!meta.description) {
    issues.push({ level: 'critical', message: 'Missing meta description.' });
  } else {
    if (meta.description.length < 50) issues.push({ level: 'warning', message: 'Meta description is too short. Aim for 150-160 chars.' });
    if (meta.description.length > 160) issues.push({ level: 'warning', message: `Meta description is long (${meta.description.length} chars). It may be truncated.` });
    issues.push({ level: 'success', message: 'Meta description is present.' });
  }

  // 3. Open Graph Checks
  if (!meta.ogImage) {
    issues.push({ level: 'warning', message: 'Missing Open Graph Image (og:image). Link previews will lack a visual.' });
  } else {
    issues.push({ level: 'success', message: 'Open Graph image is present.' });
  }

  if (!meta.ogTitle) issues.push({ level: 'info', message: 'Missing og:title. Facebook will try to use the page title.' });
  if (!meta.ogDescription) issues.push({ level: 'info', message: 'Missing og:description.' });

  // 4. Twitter Checks
  if (!meta.twitterCard) issues.push({ level: 'info', message: 'Missing twitter:card meta tag. Defaults to "summary".' });

  // 5. Canonical
  if (!meta.canonical) {
    issues.push({ level: 'warning', message: 'Missing canonical link tag. This helps prevent duplicate content issues.' });
  }

  return {
    url,
    meta,
    issues,
    preview: {
      google: !!(meta.title && meta.description),
      facebook: !!(meta.ogTitle || meta.title),
      twitter: !!(meta.twitterTitle || meta.title)
    }
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.analyze.path, async (req, res) => {
    try {
      const { url } = api.analyze.input.parse(req.body);
      
      try {
        const html = await fetchHtml(url);
        const result = analyzeSeo(url, html);
        
        // Save to history asynchronously (don't block response)
        storage.addToHistory(url, result.meta.title).catch(err => 
          console.error("Failed to save history:", err)
        );

        res.json(result);
      } catch (fetchError) {
        // If it's a fetch error, we return 400 or 500 depending on nature, but usually 
        // if the URL is unreachable it's a client error (invalid URL or down) or server error.
        // Let's treat it as a validation error for the user "Could not access URL"
        return res.status(400).json({ 
          message: `Could not access URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` 
        });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.history.list.path, async (_req, res) => {
    try {
      const history = await storage.getHistory();
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  app.delete(api.history.clear.path, async (_req, res) => {
    await storage.clearHistory();
    res.status(204).end();
  });

  return httpServer;
}
