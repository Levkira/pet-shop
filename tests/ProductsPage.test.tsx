import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import uiReducer from '../src/features/ui/uiSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../src/data/products';
import ProductsPage from '../src/pages/ProductsPage';
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
      <ProductsPage />
    </AppProviders>
  );
}

describe('ProductsPage', () => {
  it('renders every product once loaded', async () => {
    renderPage();
    for (const product of products) {
      expect(
        await screen.findByRole(
          'heading',
          { name: product.title },
          { timeout: 3000 }
        )
      ).toBeInTheDocument();
    }
  });

  it('filters the grid as the person types in the search box', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('heading', { name: 'Scratcher' }, { timeout: 3000 });

    await user.type(screen.getByPlaceholderText('Search products…'), 'tunnel');

    expect(screen.getByRole('heading', { name: 'Tunnel' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Scratcher' })).not.toBeInTheDocument();
  });

  it('shows a no-results message when nothing matches the search', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('heading', { name: 'Scratcher' }, { timeout: 3000 });

    await user.type(
      screen.getByPlaceholderText('Search products…'),
      'nonexistent-product-xyz'
    );

    expect(screen.getByText(/No products match/)).toBeInTheDocument();
  });
});
