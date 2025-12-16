# Mal's Mandi - E-commerce Showcase Website

## Overview
Mal's Mandi is a production-ready e-commerce showcase website built with Next.js, TypeScript, and TinaCMS. It features product browsing with WhatsApp enquiry functionality (no cart/checkout).

## Current State
- **Status**: MVP Complete
- **Last Updated**: December 2024

## Tech Stack
- **Framework**: Next.js 14 with TypeScript (Pages Router)
- **Styling**: Tailwind CSS with custom CSS variables
- **CMS**: TinaCMS (file-based, Git-backed)
- **Deployment Target**: Vercel

## Project Structure
```
├── content/
│   ├── categories/          # Category JSON files
│   └── products/            # Product JSON files
├── public/
│   └── uploads/             # Product images
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── CategoryChip.tsx
│   │   ├── ProductCard.tsx
│   │   └── ImageGallery.tsx
│   ├── lib/
│   │   ├── data.ts          # Data helpers (getAllCategories, getAllProducts, etc.)
│   │   └── whatsapp.ts      # WhatsApp link utilities
│   ├── pages/
│   │   ├── index.tsx        # Home page
│   │   ├── category/[slug].tsx
│   │   ├── product/[slug].tsx
│   │   └── 404.tsx
│   └── styles/
│       └── globals.css
└── tina/
    └── config.ts            # TinaCMS schema configuration
```

## Environment Variables
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number for enquiries (digits only, no +)
- `NEXT_PUBLIC_SITE_URL`: Site URL for product links (defaults to http://localhost:5000)

## Key Features
1. **Home Page**: Hero section, category list, filterable product grid
2. **Category Pages**: /category/[slug] - Products filtered by category
3. **Product Pages**: /product/[slug] - Product details with WhatsApp CTA
4. **CMS Admin**: /admin - TinaCMS for content management
5. **WhatsApp Integration**: Enquiry buttons with pre-filled messages

## Categories
15 categories pre-configured:
- Customized Gifts, Apparel, Bags, Jewelry, Paintings
- Art Prints, Wall Decor, Home Decor, Home Furnishings
- Kitchen & Dining, Stationery & Office, Kids & Baby
- Events & Parties, Custom Requests, Seasonal Decor

## Theme Colors
- Primary: White (#ffffff)
- Secondary: Black (#000000)
- Accent: Magenta/Pink (#e91e8c)

## Development
```bash
npm run dev    # Start dev server with TinaCMS
npm run build  # Build for production
```

## User Preferences
- Modern, clean minimal UI
- No cart/checkout functionality
- WhatsApp-based enquiries only
