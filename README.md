# 🐾 Pet Shop

A small e-commerce demo — browse pet products, read reviews, add them to
a cart, and check out. Built with React, TypeScript, and Redux Toolkit,
styled with Tailwind.

> **Note:** the product catalog and checkout are both mocked by default.
> There's no real payment processor, but there **is** a real Express
> backend included (`server/`) that you can point the frontend at — see
> [Mock services](#mock-services) below.

## Features

- 🏠 Landing page with featured (top-rated) products, trust badges, and
  brand copy
- 🔍 Product catalog with search, sort (price/rating), URL-synced
  numbered pagination, star ratings, and loading states
- 📄 Product detail pages with a quantity selector and customer reviews
- 🛒 Persistent cart (survives page reloads) with quantity controls
- 💳 Checkout flow with real form validation and an order confirmation
- 🔔 Toast notifications on add-to-cart
- 🔎 Per-page SEO tags (title, meta description, Open Graph)
- ♿ Skip-to-content link, visible focus states, one `<h1>` per page, and
  an error boundary so a page crash doesn't blank the whole app
- 🔌 Mocked products API by default, with a real Express backend included
  (`server/`) that you can point the frontend at instead
- ✅ Unit, component, and end-to-end (cross-browser) test coverage
- 🧹 ESLint + Prettier, and a CI pipeline that runs all of it

## Tech stack

| | |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build tool** | Vite |
| **State** | Redux Toolkit, RTK Query |
| **Routing** | React Router |
| **Styling** | Tailwind CSS |
| **Forms** | React Hook Form + Zod |
| **SEO** | react-helmet-async |
| **Demo backend** | Express, cors, helmet, morgan |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Tooling** | ESLint, Prettier, GitHub Actions |

## Getting started

**Prerequisites:** Node 18 or later.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run server` | Start the demo Express backend on `http://localhost:4000` |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run unit/component tests in watch mode |
| `npm run test:run` | Run unit/component tests once |
| `npm run test:e2e` | Run Playwright end-to-end tests (starts the dev server itself) |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing changes |

## Testing

**Unit & component tests** (Vitest + React Testing Library) live in
`tests/` and cover the cart reducer, the mocked products API, the demo
Express backend, and every page.

```bash
npm run test:run
```

**End-to-end tests** (Playwright) live in `e2e/` and cover the full
add-to-cart → checkout → confirmation flow, form validation, and product
search/sort/navigation. They run against Chromium, Firefox, and WebKit.

```bash
npx playwright install  
npm run test:e2e
```

## Project structure

```
src/
  types.ts                    Product, Review, CartItem types
  vite-env.d.ts                Vite ambient types (import.meta.env, etc.)
  data/products.ts            static product catalog (the mock "backing store")
  api/productsApi.ts          RTK Query slice — mock by default, or the real
                                Express backend via VITE_API_BASE_URL (see below)
  features/
    cart/
      cartSlice.ts             add/remove/update/clear cart items
      useCartRows.ts           cart items joined with product data + total
      useSyncCartWithCatalog.ts prunes cart entries with no matching product
    ui/uiSlice.ts               toast notification state
  store.ts                     Redux store setup + localStorage cart persistence
  hooks.ts                     typed useAppSelector/useAppDispatch
  components/                  Nav, ProductCard, ProductCardSkeleton, CartList,
                                QuantityStepper, Rating, Toast, Seo,
                                ErrorBoundary, Pagination
  pages/                       HomePage, ProductsPage, ProductDetailPage,
                                CartPage, CheckoutPage, NotFoundPage
  Shop.tsx                     route definitions, skip link, error boundary
  App.tsx                      Redux/Router/Helmet providers
server/                        real Express backend (see server/README.md)
  index.js                     entry point — starts the app on a real port
  app.js                       Express app factory (middleware, routes)
  data.js                       plain-JS copy of the catalog (see file header)
  routes/products.routes.js     path → controller mapping
  controllers/products.controller.js  request handlers
  middleware/                   notFound.js, errorHandler.js
tests/                         Vitest + React Testing Library
e2e/                            Playwright (chromium, firefox, webkit)
.github/workflows/ci.yml       lint, test, build, and e2e on every push/PR
```

## Mock service

- **Checkout** (`src/pages/CheckoutPage.tsx`) — the form validates for
  real, but submitting just simulates a short delay, generates a fake
  order number, and clears the cart. No payment provider is called.
  Swapping in something like Stripe means replacing the `setTimeout` with
  a real API call.
