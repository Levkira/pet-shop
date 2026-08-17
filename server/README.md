# Pet Shop demo backend

A small Express API backing the products catalog, standing in for a real
backend. See the main [README](../README.md#mock-services) for how to
point the frontend at this instead of the built-in mock.

```bash
npm run server        # starts on http://localhost:4000 by default
PORT=5000 npm run server   # or a different port
```

## Layout

```
server/
  index.js              entry point — starts the app on a real port
  app.js                Express app factory (routes, middleware, no listen())
  data.js                the product catalog (plain-JS copy of src/data/products.ts)
  routes/
    products.routes.js   HTTP verb + path → controller function
  controllers/
    products.controller.js  request handlers (reads data.js, shapes responses)
  middleware/
    notFound.js           404 handler, registered after all real routes
    errorHandler.js        centralized error handler, registered last
```

`app.js` builds the app without starting it, specifically so it can be
imported and exercised in tests (`tests/server.test.ts`) on an ephemeral
port instead of the real one — `index.js` is the only file that actually
calls `.listen()`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check — `{ "status": "ok" }` |
| GET | `/products` (or `/api/products`) | Full catalog |
| GET | `/products/:id` (or `/api/products/:id`) | Single product, 404 if not found |

## Adding a new resource

Follow the same pattern as `products`:

1. Add data access / shaping logic in a new `controllers/<resource>.controller.js`.
2. Add a `routes/<resource>.routes.js` mapping paths to those controller functions.
3. Mount it in `app.js`: `app.use('/<resource>', <resource>Router)`.
4. Errors: call `next(error)` with an `Error` (optionally with a `.status`)
   from a controller — `errorHandler` handles the response, so controllers
   never need their own try/catch-and-respond boilerplate for expected
   failure cases.

## Not production-hardened

This is a demo matching the shape `productsApi.ts` expects, not a
deployable service:

- **Data**: an in-memory array (`data.js`), not a database. Restarting
  the process resets nothing (there's no mutation yet), but there's also
  nowhere to persist writes if you add any.
- **CORS**: wide open (`cors()` with no options reflects any origin).
  Lock this down to a real allowlist before deploying anywhere reachable
  by the public internet.
- **No auth.** Every endpoint is unauthenticated.
- **No rate limiting, request validation, or structured logging** beyond
  `morgan`'s dev-format request log.
