# Keian Luxandor — Jewellery E-commerce

```
KEIAN-LUXANDOR/
├── frontend/
│   ├── customer-website/   Next.js + TypeScript website customers see (ready)
│   └── admin-panel/        Next.js + TypeScript staff admin panel (ready, demo data until the backend is added)
│
└── backend/
    └── keian-luxandor/     Spring Boot REST API + database (planned)
```

## Run the website

```
cd frontend/customer-website
npm install      # first time only
npm run dev      # http://localhost:5173
```

Shortcut: `npm run dev`, `npm run build` and `npm run preview` also work from this top folder.

## Run the admin panel

```
cd frontend/admin-panel
npm install      # first time only
npm run dev      # http://localhost:5174
```

Demo sign-in: `admin@keianluxandor.com` / `keian-admin` (for testing only).
Shortcuts from this top folder: `npm run install-admin`, `npm run dev:admin`, `npm run build:admin`.
Details, pages and the backend endpoints it needs are in `frontend/admin-panel/README.md`.

## How the parts connect

- The **backend** runs on port 8080 and answers `/api/...` requests (products today; accounts, orders and payments next).
- The **customer website** forwards every `/api/...` call to the backend (`BACKEND_URL`, default `http://localhost:8080`).
  The endpoints it expects are listed in `frontend/customer-website/README.md`.
- The **admin panel** is a separate app in `frontend/admin-panel` on port 5174. Until the backend has
  admin endpoints it uses demo data saved in the browser; set `NEXT_PUBLIC_ADMIN_API=true` to switch it to
  the backend's `/api/admin/...` endpoints (protected by staff roles).

## Saving your work to GitHub

```
git add .
git commit -m "describe your change"
git push
```
