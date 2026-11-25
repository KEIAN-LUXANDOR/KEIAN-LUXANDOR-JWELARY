# Keian Luxandor — Customer Website

The customer website, built with **Next.js 16** (App Router) and **TypeScript**.

## Run it on your computer

```
cd frontend/customer-website
npm install      # first time only (and after pulling new packages)
npm run dev      # editing mode: http://localhost:5173
```

Product pages need the Spring Boot backend running. The website forwards every `/api/...` request to
http://localhost:8080 (set in `next.config.ts`). To use a different backend address, create `.env.local`:

```
BACKEND_URL=http://your-server:8080
```

Check the real (fast) version: `npm run build` (also checks all TypeScript types), then `npm run start` → http://localhost:4173.
`npm run lint` checks the code style.

## Where things are

```
public/
├── images/        product & category photos (ring.webp + ring-400.webp small copy …)
├── banners/       home page banners
├── icons/         logos and favicon
├── videos/        "Our Craft" video + poster
└── fonts/         Ibarra Real Nova + Jost (served from here, not Google Fonts)

src/
├── app/                         one folder per web address
│   ├── (store)/                 home, diamond-gold|silver|rose|white, rings, earrings, necklaces,
│   │                            bracelets, pendants, product/[slug], search, wishlist,
│   │                            collections/[slug], about-us, our-values, contact-us, store-locator, guides …
│   ├── (checkout)/              cart, checkout, order-confirmation
│   ├── (account)/               login, register, profile, orders, addresses
│   ├── layout.tsx               frame around every page (fonts, header, footer)
│   ├── globals.css              colours, fonts and shared styles
│   └── not-found.tsx            404 page
├── components/                  reusable design parts
│   ├── header/ footer/ navigation/
│   ├── product-card/ product-gallery/ filters/
│   ├── home/                    home page sections (Hero, ZigZagStory, OurCraft, Benefits …)
│   └── common/                  Icon, Logo, Media, Modal, PageHero, Reveal, form fields, chat, appointment
├── features/                    business functionality (components / hooks / services / types / utils)
│   ├── products/                product card, details, gallery, specifications, filters, productService
│   ├── categories/              the four metal pages + jewellery types
│   ├── cart/ checkout/ wishlist/ orders/ payments/
│   ├── authentication/ customer-profile/
│   └── search/
├── services/apiClient.ts        the single connection to the backend (/api/...)
├── hooks/                       useFetch, useEscapeKey, useLockBodyScroll, usePersistentState
├── types/                       shared data definitions
├── utils/                       formatPrice, storage, validation, text helpers
└── lib/                         site settings, shared state providers, menu/home/footer content
```

One product system serves every metal and jewellery type. The metal pages and type pages only choose
*which* products to ask for (`features/categories/utils/categoryConfig.ts`).

## Backend endpoints

| Used by | Endpoint | Status |
|---|---|---|
| products | `GET /api/products`, `GET /api/products?tag=rings`, `GET /api/products/{id}` | in the backend now |
| authentication | `POST /api/auth/login`, `/register`, `/logout` | to add |
| customer-profile | `PUT /api/customers/me`, `GET/PUT /api/customers/me/addresses` | to add |
| orders | `POST /api/orders`, `GET /api/orders/{id}`, `PUT /api/orders/{id}/payment`, `GET /api/customers/me/orders` | to add |
| payments | `POST /api/payments/session` (card details are never collected on this site) | to add |

Until those are added, sign-in, addresses and orders are saved in the browser so every page can be tested
(**the demo sign-in does not check passwords**). When the backend has them, set `NEXT_PUBLIC_CUSTOMER_API=true` in `.env.local`.

Product photos moved to `public/images/`. The backend's sample data still uses `/ring.webp` etc.;
`next.config.ts` keeps those addresses working, but new products should use `/images/ring.webp`.

## Good to know

- Files that use clicks, state or the browser start with `'use client'`.
- Links use `import Link from 'next/link'` and `<Link href="/about-us">`.
- Imports start with `@/`, which means the `src` folder: `import Icon from '@/components/common/Icon'`.
