import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import uiReducer from '../src/features/ui/uiSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../server/data.js';
import ProductDetailPage from '../src/pages/ProductDetailPage';
import { AppProviders } from './test-utils';

function renderAtProduct(id: string) {
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
    <AppProviders store={store} initialEntries={[`/products/${id}`]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </AppProviders>
  );
  return store;
}

describe('ProductDetailPage', () => {
  it('adds the selected quantity to the cart and shows a confirmation toast', async () => {
    const user = userEvent.setup();
    const product = products[0];
    const store = renderAtProduct(product.id);

    await screen.findByLabelText('Increase quantity', undefined, { timeout: 3000 });
    await user.click(screen.getByLabelText('Increase quantity'));
    await user.click(screen.getByLabelText('Increase quantity'));
    await user.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(store.getState().cart).toEqual([{ id: product.id, amount: 3 }]);
    expect(store.getState().ui.toast).toMatch(/Added 3 items/);
  });

  it('shows the product reviews', async () => {
    const product = products[0];
    renderAtProduct(product.id);

    expect(
      await screen.findByRole('heading', { name: 'Reviews' }, { timeout: 3000 })
    ).toBeInTheDocument();
    expect(screen.getByText(product.reviews[0].comment)).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown product id', async () => {
    renderAtProduct('does-not-exist');
    expect(
      await screen.findByText('Product not found', undefined, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
