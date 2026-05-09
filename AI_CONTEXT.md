# AI Context & Documentation (llms.txt)

## Project Overview
This repository contains a modern, high-conversion e-commerce platform and management dashboard (CMS) tailored for independent brands (e.g., "AClub"). The application features a storefront with a WhatsApp-based order flow and an admin dashboard to handle catalogs, settings, products, product variants, images, and customer reviews.

## Architecture & Tech Stack
-   **Framework**: React 18+ (Vite builder)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (Utility-first, brutalist & premium aesthetic)
-   **Animations**: `motion/react` (Framer Motion)
-   **Icons**: `lucide-react`
-   **Routing**: `react-router-dom`
-   **Database / Backend**: Firebase (Firestore)
-   **Authentication**: Firebase Auth (for the Admin back-office)

## Brand Design & UI/UX Patterns
-   **Colors**: Custom theme defined in Tailwind (`brand-noir`, `brand-blanc`, `brand-kaki`, `brand-gris`).
-   **Typography**: 
    -   `font-display` (e.g., uppercase, `tracking-widest`, bold) for headings/CTA.
    -   `font-sans` for main readable text.
    -   `font-mono` for specific data, dates, and metrics.
-   **Interactions**: Smooth page transitions using `<PageTransition />` wrapper. Micro-interactions natively built with Tailwind (e.g., `hover:scale-105`, `transition-transform`).
-   **Layout**: Minimalist borders (`border-[#222]` or `border-[#333]`), strict mobile-first responsive design, touch-friendly areas.

## Core File Structure
```text
/
├── src/
│   ├── components/
│   │   ├── admin/      # Back-office components (e.g., ImageUpload)
│   │   ├── store/      # Storefront components (ProductReviews, CartDrawer, StoreLayout)
│   │   └── ui/         # Reusable atoms (Buttons, PageTransitions, FloatingWhatsApp)
│   ├── pages/
│   │   ├── admin/      # Protected CMS pages (Dashboard, ProductsManager, AdminSettings, etc.)
│   │   └── store/      # Public pages (HomePage, CatalogPage, ProductPage)
│   ├── services/       # External APIs (firebaseService.ts)
│   ├── store/          # Global State Management (AppContext.tsx)
│   └── types/          # Global TS definitions & Data Models
├── firestore.rules     # DB access constraints
└── index.html          # Entry boundary
```

## Global State (`AppContext.tsx`)
Avoid excessive prop-drilling or external state managers. Reusable global logic and fast-access data (like the live catalog, shopping cart, and application settings) are managed inside `AppContext`.
-   **State includes**: `products`, `categories`, `cart` items, `settings` (WhatsApp number, message templates, etc.).
-   **Actions**: `addToCart`, `removeFromCart`, `trackWhatsAppClick`.

## Database Schema (Firestore)
-   `categories`: `{ name, slug, description, image_url, isActive, displayOrder }`
-   `products`: `{ title, slug, price, compareAtPrice, description, categoryId, isActive, isFeatured, isNew, statusBadge, displayOrder }`
-   `product_variants`: `{ productId, name, value, sku, stock_quantity }`
-   `product_images`: `{ productId, image_url, displayOrder }`
-   `product_reviews`: `{ productId, authorName, rating, comment, status, createdAt }`
-   `settings`: Document mapping store preferences (`whatsappNumber`, `defaultWhatsappMessage`, `contactEmail`, etc.)

## Development Guidelines for AI Crawlers
1.  **Tailwind Exclusivity**: Do not use custom CSS, inline styles, or styled-components. Standardize all aesthetics through Tailwind utility classes.
2.  **UI Integrity**: Maintain brutalist patterns. Heavy reliance on dark backgrounds, high-contrast borders (`#333`), and stark minimal padding. Use uppercase headers with `tracking-widest`.
3.  **WhatsApp Integration**: E-commerce checkouts and major CTA events route through formatted `wa.me/` URLs utilizing `settings.whatsappNumber`.
4.  **Backend Integrity**: Do not spoof API calls. Always add features using actual API/Firebase integration. Read `src/services/firebaseService.ts` before modifying data retrieval flows.
5.  **Types**: Follow TypeScript strict interfaces located in `src/types.ts` or inline at the top of components.
