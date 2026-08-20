// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from '../server/app.js';
import { products } from '../server/data.js';

let baseUrl: string;
let httpServer: Server;

beforeAll(() => {
  const app = createApp();
  return new Promise<void>((resolve) => {
    httpServer = app.listen(0, () => {
      const { port } = httpServer.address() as AddressInfo;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(() => {
  return new Promise<void>((resolve, reject) => {
    httpServer.close((err) => (err ? reject(err) : resolve()));
  });
});

describe('demo backend (Express)', () => {
  it('GET /health reports ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('GET /api/products returns the full catalog', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(products);
  });

  it('GET /api/products/:id returns a single product', async () => {
    const target = products[1];
    const res = await fetch(`${baseUrl}/api/products/${target.id}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(target);
  });

  it('GET /api/products/:id returns a 404 with a JSON error body for an unknown id', async () => {
    const res = await fetch(`${baseUrl}/api/products/does-not-exist`);
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ message: expect.any(String) });
  });

  it('the unprefixed /products route is no longer mounted (regression test for the /api-only route change)', async () => {
    const res = await fetch(`${baseUrl}/products`);
    expect(res.status).toBe(404);
  });

  it('sends permissive CORS headers by default', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('sends security headers from helmet', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('returns a JSON 404 for unmatched routes', async () => {
    const res = await fetch(`${baseUrl}/does-not-exist`);
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ message: expect.any(String) });
  });
});
