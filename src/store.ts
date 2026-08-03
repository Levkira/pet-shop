import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import uiReducer from './features/ui/uiSlice';
import { productsApi } from './api/productsApi';
import type { CartItem } from './types';

const CART_STORAGE_KEY = 'pet-shop:cart';

function loadCartFromStorage(): CartItem[] | undefined {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  preloadedState: {
    cart: loadCartFromStorage(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

store.subscribe(() => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart));
  } catch {
    // Ignore write failures (storage full, private browsing, etc.)
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
