import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import uiReducer from '../src/features/ui/uiSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../src/data/products';
import HomePage from '../src/pages/HomePage';
import { AppProviders } from './test-utils';

function renderPage() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });
  render(
    <AppProviders store={store}>
      <HomePage />
    </AppProviders>
  );
  return store;
}

describe('HomePage', () => {
  it('shows the three highest-rated products as featured', async () => {
    renderPage();

    const topThree = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);

    for (const product of topThree) {
      expect(
        await screen.findByRole('heading', { name: product.title }, { timeout: 3000 })
      ).toBeInTheDocument();
    }

    const lowestRated = [...products].sort((a, b) => a.rating - b.rating)[0];
    expect(
      screen.queryByRole('heading', { name: lowestRated.title })
    ).not.toBeInTheDocument();
  });

  it('shows an average rating summary computed from the catalog', async () => {
    renderPage();

    const expectedAverage = (
      products.reduce((sum, p) => sum + p.rating, 0) / products.length
    ).toFixed(1);

    expect(
      await screen.findByText(
        new RegExp(`${expectedAverage} average rating`),
        undefined,
        { timeout: 3000 }
      )
    ).toBeInTheDocument();
  });

  it('adds a featured product to the cart and shows a confirmation toast', async () => {
    const user = userEvent.setup();
    const store = renderPage();

    const topProduct = [...products].sort((a, b) => b.rating - a.rating)[0];
    await screen.findByRole('heading', { name: topProduct.title }, { timeout: 3000 });

    const addButtons = screen.getAllByRole('button', { name: 'Add to cart' });
    await user.click(addButtons[0]);

    expect(store.getState().cart.some((item) => item.amount === 1)).toBe(true);
    expect(store.getState().ui.toast).toMatch(/Added ".*" to your cart/);
  });
});
