import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '../src/api/productsApi';
import { products } from '../server/data.js';

function makeStore() {
  return configureStore({
    reducer: { [productsApi.reducerPath]: productsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });
}

describe('productsApi', () => {
  it('getProducts resolves with the full catalog', async () => {
    const store = makeStore();
    const result = await store.dispatch(productsApi.endpoints.getProducts.initiate());
    expect(result.data).toEqual(products);
  });

  it('getProductById resolves a single product by id', async () => {
    const store = makeStore();
    const target = products[1];
    const result = await store.dispatch(
      productsApi.endpoints.getProductById.initiate(target.id)
    );
    expect(result.data).toEqual(target);
  });

  it('getProductById returns an error for an unknown id', async () => {
    const store = makeStore();
    const result = await store.dispatch(
      productsApi.endpoints.getProductById.initiate('nope')
    );
    expect(result.error).toMatchObject({ status: 404 });
  });
});
