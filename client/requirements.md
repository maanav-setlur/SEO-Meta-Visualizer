## Packages
framer-motion | Smooth animations for tab switching and result reveals
clsx | Conditional class merging
tailwind-merge | Tailwind class conflict resolution

## Notes
- Tailwind config should support 'font-display' (Outfit) and 'font-body' (Inter) as per the design guidelines.
- Backend handles the actual scraping; frontend focuses on presentation.
- Open Graph images might be broken or blocked by CORS; using a standard <img> tag, but if they fail to load, we should show a fallback.
