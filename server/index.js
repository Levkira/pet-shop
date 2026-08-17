// Entry point — starts the Express app defined in app.js on a real port.
// This file only runs the "start listening" side effect; `app.js` holds
// the actual app configuration so it can be imported and tested without
// binding to a real port (see tests/server.test.ts).
//
// Usage:
//   npm run server
//   # then, in .env.local (see .env.example):
//   VITE_API_BASE_URL=http://localhost:4000
//
// With that env var set, src/api/productsApi.ts routes every request
// through here instead of the in-memory mock.

import { createApp } from './app.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pet Shop Express backend listening on http://localhost:${PORT}`);
  console.log('  GET /health');
  console.log('  GET /products');
  console.log('  GET /products/:id');
});
