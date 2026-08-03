# 🐾 Pet Shop

A small e-commerce demo — browse pet products, read reviews, add them to
a cart, and check out. Built with React, TypeScript, and Redux Toolkit,
styled with Tailwind.

> **Note:** the product catalog and checkout are both mocked. There's no
> real backend and no real payment processor — see
> [Mock services](#mock-services) below for what that means and how to
> swap in real ones.

## Features

- 🔍 Product catalog with search, sort (price/rating), star ratings, and
  loading states
- 📄 Product detail pages with a quantity selector and customer reviews
- 🛒 Persistent cart (survives page reloads) with quantity controls
- 💳 Checkout flow with real form validation and an order confirmation
- 🔔 Toast notifications on add-to-cart
- 🔎 Per-page SEO tags (title, meta description, Open Graph)
- ✅ Unit, component, and end-to-end test coverage
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
`tests/` and cover the cart reducer, the mocked products API, and every
page.

```bash
npm run test:run
```

**End-to-end tests** (Playwright) live in `e2e/` and cover the full
add-to-cart → checkout → confirmation flow, form validation, and product
search/sort/navigation.

```bash
npx playwright install   # first time only, downloads browser binaries
npm run test:e2e
```

## Project structure

```
src/
  types.ts                    Product, Review, CartItem types
  data/products.ts            static product catalog (the mock "backing store")
  api/productsApi.ts          RTK Query slice — see Mock services below
  features/
    cart/
      cartSlice.ts             add/remove/update/clear cart items
      useCartRows.ts           cart items joined with product data + total
      useSyncCartWithCatalog.ts prunes cart entries with no matching product
    ui/uiSlice.ts               toast notification state
  store.ts                     Redux store setup + localStorage cart persistence
  hooks.ts                     typed useAppSelector/useAppDispatch
  components/                  Nav, ProductCard, CartList, QuantityStepper,
                                Rating, Toast, Seo
  pages/                       HomePage, ProductsPage, ProductDetailPage,
                                CartPage, CheckoutPage, NotFoundPage
  Shop.tsx                     route definitions
  App.tsx                      Redux/Router/Helmet providers
tests/                         Vitest + React Testing Library
e2e/                            Playwright
.github/workflows/ci.yml       lint, test, build, and e2e on every push/PR
```

## Mock services

Two things in this app are intentionally mocked rather than wired up to
real services:

- **Products API** (`src/api/productsApi.ts`) — a real RTK Query slice
  (`getProducts`/`getProductById`, with cache tags and loading/error
  states) sitting on top of a `baseQuery` that resolves against the local
  catalog with a simulated network delay instead of a real HTTP call.
  Every component consuming it (`useGetProductsQuery`, etc.) is written
  exactly as it would be against a real backend — pointing this at a real
  API means swapping `mockBaseQuery` for `fetchBaseQuery({ baseUrl })`
  and nothing else changes.
- **Checkout** (`src/pages/CheckoutPage.tsx`) — the form validates for
  real, but submitting just simulates a short delay, generates a fake
  order number, and clears the cart. No payment provider is called.
  Swapping in something like Stripe means replacing the `setTimeout` with
  a real API call.

## Roadmap / not yet implemented

- Error boundary around the app shell
- Pagination on the product grid (fine at today's catalog size)
- A real backend behind `productsApi`
- Broader accessibility audit (focus management, contrast check)
- Cross-browser E2E coverage (CI currently runs Chromium only — add
  `firefox`/`webkit` projects to `playwright.config.ts` if you need it)
