# Keian Luxandor — Admin Panel

The staff admin panel for the Keian Luxandor store, built with **Next.js 16** (App Router) and **TypeScript**,
in the same colours and fonts as the customer website.

## Run it

```
cd frontend/admin-panel
npm install      # first time only
npm run dev      # http://localhost:5174
```

Until the backend has admin endpoints, the panel runs in **demo mode**: realistic products, orders, customers and
payments are saved in your browser, so every page works. Sign in with:

- Email: `admin@keianluxandor.com`
- Password: `keian-admin`

Other demo admins: `riya@keianluxandor.com` (Manager), `daniel@keianluxandor.com` (Staff — fewer pages), same password.
**Settings → Reset demo data** puts the original data back. The demo password is for testing only.

| Command | What it does |
|---|---|
| `npm run dev` | Editing mode on port 5174 (the customer website uses 5173) |
| `npm run build` | Production build (also checks all TypeScript types) |
| `npm start` | Run the production build on port 4174 |
| `npm run lint` | Code style checks |
| `npm run typecheck` | TypeScript checks only |
| `npm test` | Unit and component tests (`tests/components`, `tests/features`) |
| `npm run test:e2e` | Browser tests (`tests/e2e`). First time: `npx playwright install chromium` |

## Pages

| Address | Page |
|---|---|
| `/login`, `/forgot-password` | Sign in, reset password |
| `/dashboard` | Revenue, orders, average order, new customers, sales by metal, latest orders, low stock |
| `/products`, `/products/add`, `/products/[id]` | Product list, add, edit (with suggested price from metal rate) |
| `/products/categories` | Categories in the website menu |
| `/specifications` | Choices for purity, diamond shape, colour, clarity, ring size, finish |
| `/inventory` | Stock levels, low / out of stock |
| `/pricing` | Metal rate per gram, making charge, bulk price changes |
| `/orders`, `/orders/[id]` | Orders, status changes with tracking number and history |
| `/customers`, `/customers/[id]` | Customers, their orders, notes, block / email preferences |
| `/payments` | Payments and refunds |
| `/offers`, `/coupons` | Automatic discounts and checkout codes |
| `/banners` | Home page banners |
| `/reviews` | Approve / hide customer reviews |
| `/reports` | Sales for 30 / 90 / 365 days, by category and metal, best sellers, CSV download |
| `/users` | Admin users, roles and permissions |
| `/settings` | Store details, tax, shipping, notifications |

Admins only see the pages their permissions allow (Owner = everything).

## Folder structure

```
public/           images/, icons/, logos/, fonts/
src/
├── app/
│   ├── (auth)/          login, forgot-password
│   ├── (dashboard)/     every signed-in page + layout.tsx (sidebar, top bar, sign-in check)
│   ├── layout.tsx, globals.css, error.tsx, not-found.tsx
├── components/          sidebar, header, tables, forms, buttons, modals, charts, common
├── features/            dashboard, products, categories, specifications, inventory, pricing, orders,
│                        customers, payments, offers, coupons, banners, reviews, reports, users, settings
│                        (each: components/ services/ utils/)
├── hooks/               useResource, useRecord, useAsync, useDisclosure …
├── services/            apiClient.ts (the one connection to the backend), createResource.ts
├── lib/                 constants (the four metals, permissions), providers, mock/ (demo data)
├── types/               models.ts — every data definition
└── utils/               format, dates, csv, validation, text
tests/                   components/, features/, e2e/
```

## Connecting the Spring Boot backend

Copy `.env.example` to `.env.local` and set:

```
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_ADMIN_API=true
```

Every `/api/...` request is forwarded to `BACKEND_URL`. The panel then expects these endpoints
(each feature's `services/` file lists its own):

| Area | Endpoints |
|---|---|
| Sign in | `POST /api/admin/auth/login` → `{ token, user }`, `GET /api/admin/auth/me`, `POST /api/admin/auth/forgot-password` |
| Standard lists | `GET`/`POST /api/admin/{products, categories, specifications, orders, customers, payments, offers, coupons, banners, reviews, users}` and `GET`/`PUT`/`DELETE …/{id}` |
| Metal rates | `GET /api/admin/pricing/metal-rates`, `PUT …/{id}` |
| Refunds | `POST /api/admin/payments/{id}/refund` |
| Settings | `GET`/`PUT /api/admin/settings` |

Requests carry `Authorization: Bearer <token>`. The backend must check the admin's permissions on every
request — hiding pages in the panel is for convenience, not security. Data shapes are in `src/types/models.ts`.
