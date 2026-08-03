import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../src/data/products';
import { useSyncCartWithCatalog } from '../src/features/cart/useSyncCartWithCatalog';

function makeStore(cartState: { id: string; amount: number }[]) {
  return configureStore({
    reducer: { cart: cartReducer, [productsApi.reducerPath]: productsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState: { cart: cartState },
  });
}

describe('useSyncCartWithCatalog', () => {
  it('removes cart entries that no longer match any product once the catalog loads', async () => {
    const validId = products[0].id;
    const store = makeStore([
      { id: validId, amount: 2 },
      { id: 'stale-id-from-an-old-catalog', amount: 1 },
    ]);

    renderHook(() => useSyncCartWithCatalog(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(
      () => {
        expect(store.getState().cart).toEqual([{ id: validId, amount: 2 }]);
      },
      { timeout: 3000 }
    );
  });

  it('leaves the cart untouched when every entry matches a real product', async () => {
    const cartState = [
      { id: products[0].id, amount: 1 },
      { id: products[1].id, amount: 3 },
    ];
    const store = makeStore(cartState);

    renderHook(() => useSyncCartWithCatalog(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(
      () => {
        expect(productsApi.endpoints.getProducts.select()(store.getState()).data).toBeDefined();
      },
      { timeout: 3000 }
    );
    expect(store.getState().cart).toEqual(cartState);
  });
});
