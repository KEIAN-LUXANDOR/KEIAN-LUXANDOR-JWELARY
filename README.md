# Keian Luxandor — Jewellery E-commerce

```
KEIAN-LUXANDOR/
├── frontend/
│   ├── customer-website/   Next.js + TypeScript website customers see (ready)
│   └── admin-panel/        staff admin panel: products, orders, customers (planned)
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

## How the parts connect

- The **backend** runs on port 8080 and answers `/api/...` requests (products today; accounts, orders and payments next).
- The **customer website** forwards every `/api/...` call to the backend (`BACKEND_URL`, default `http://localhost:8080`).
  The endpoints it expects are listed in `frontend/customer-website/README.md`.
- The **admin panel** will be a separate app in `frontend/admin-panel` (run it on another port, e.g. `next dev -p 5174`),
  calling the same backend through admin-only endpoints (e.g. `/api/admin/...`) protected by staff roles.

## Saving your work to GitHub

```
git add .
git commit -m "describe your change"
git push
```
