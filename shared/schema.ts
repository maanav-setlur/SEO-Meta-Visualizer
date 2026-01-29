
import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
// Store history of analyzed sites
export const analysisHistory = pgTable("analysis_history", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisHistorySchema = createInsertSchema(analysisHistory).omit({ 
  id: true, 
  createdAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===

// 1. Analysis Request
export const analyzeRequestSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (including http:// or https://)" }),
});
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

// 2. Analysis Result Structure
export type SeoIssueLevel = "critical" | "warning" | "info" | "success";

export interface SeoIssue {
  level: SeoIssueLevel;
  message: string;
  field?: string;
}

export interface MetaTags {
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  keywords: string | null;
  author: string | null;
  
  // Open Graph
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogSiteName: string | null;

  // Twitter
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterCreator: string | null;
  twitterSite: string | null;

  // Raw for debug
  raw: Record<string, string>;
}

export interface AnalyzeResponse {
  url: string;
  meta: MetaTags;
  issues: SeoIssue[];
  preview: {
    google: boolean;
    facebook: boolean;
    twitter: boolean;
  };
}

export type HistoryItem = typeof analysisHistory.$inferSelect;
