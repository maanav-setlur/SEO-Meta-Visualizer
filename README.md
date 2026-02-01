# SEO Vision

A modern SEO meta tag analyzer that helps you optimize your website's search engine visibility and social media presence.

## Features

- **Meta Tag Analysis** - Extracts and validates title, description, Open Graph, and Twitter Card tags
- **SEO Health Score** - Visual scoring system with animated progress indicator
- **Platform Previews** - See how your site appears on Google, Facebook, and Twitter
- **Actionable Suggestions** - Get specific recommendations to improve your SEO score
- **Mobile Responsive** - Works seamlessly on desktop and mobile devices

## How It Works

1. Enter any website URL (no need to type `https://`)
2. View your SEO health score and detailed audit report
3. Check platform previews to see how your content appears when shared
4. Follow the suggestions tab to improve your score

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui

## What Gets Analyzed

| Category | Tags Checked |
|----------|--------------|
| Basic SEO | Title, Meta Description, Canonical URL |
| Open Graph | og:title, og:description, og:image, og:url |
| Twitter Cards | twitter:card, twitter:title, twitter:image |
| Technical | Robots, Keywords, Author |

## Scoring System

- **100-80**: Excellent - Your page is well optimized
- **79-50**: Needs Improvement - Some important tags are missing
- **Below 50**: Poor - Critical SEO elements need attention

Penalties:
- Missing critical tags: -15 points each
- Missing recommended tags: -5 points each

## Running Locally

```bash
npm install
npm run dev
```

The app runs on port 5000.

## License

MIT
