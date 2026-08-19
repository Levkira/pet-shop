import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import uiReducer from '../src/features/ui/uiSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../server/data.js';
import ProductsPage, { PAGE_SIZE } from '../src/pages/ProductsPage';
import { AppProviders } from './test-utils';

function renderPage(initialEntries?: string[]) {
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
    <AppProviders store={store} initialEntries={initialEntries}>
      <ProductsPage />
    </AppProviders>
  );
}

const firstPageTitles = products.slice(0, PAGE_SIZE).map((p) => p.title);
const secondPageTitles = products.slice(PAGE_SIZE).map((p) => p.title);

describe('ProductsPage', () => {
  it('shows only the first page of products by default', async () => {
    renderPage();

    for (const title of firstPageTitles) {
      expect(
        await screen.findByRole('heading', { name: title }, { timeout: 3000 })
      ).toBeInTheDocument();
    }
    for (const title of secondPageTitles) {
      expect(screen.queryByRole('heading', { name: title })).not.toBeInTheDocument();
    }
  });

  it('shows the rest of the catalog on page 2, and hides page 1', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('heading', { name: firstPageTitles[0] }, { timeout: 3000 });
    await user.click(screen.getByRole('button', { name: 'Page 2' }));

    for (const title of secondPageTitles) {
      expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
    }
    for (const title of firstPageTitles) {
      expect(screen.queryByRole('heading', { name: title })).not.toBeInTheDocument();
    }
  });

  it('opens directly on the page given in the URL', async () => {
    renderPage(['/products?page=2']);

    for (const title of secondPageTitles) {
      expect(
        await screen.findByRole('heading', { name: title }, { timeout: 3000 })
      ).toBeInTheDocument();
    }
  });

  it('resets to page 1 when the search query changes', async () => {
    const user = userEvent.setup();
    renderPage(['/products?page=2']);

    await screen.findByRole('heading', { name: secondPageTitles[0] }, { timeout: 3000 });
    await user.type(screen.getByPlaceholderText('Search products…'), 'a');

    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page');
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
