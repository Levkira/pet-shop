import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../src/data/products';
import CartPage from '../src/pages/CartPage';
import { AppProviders } from './test-utils';

function renderWithStore(cartState: { id: string; amount: number }[]) {
  const store = configureStore({
    reducer: { cart: cartReducer, [productsApi.reducerPath]: productsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState: { cart: cartState },
  });
  render(
    <AppProviders store={store}>
      <CartPage />
    </AppProviders>
  );
  return store;
}

describe('CartPage', () => {
  it('shows the running total for items in the cart', async () => {
    const [first] = products;
    renderWithStore([{ id: first.id, amount: 2 }]);

    const expectedTotal = (first.price * 2).toFixed(2);
    expect(
      await screen.findByText(`Total $${expectedTotal}`, undefined, { timeout: 3000 })
    ).toBeInTheDocument();
  });

  it('increases the total when the quantity stepper is clicked', async () => {
    const [first] = products;
    const user = userEvent.setup();
    renderWithStore([{ id: first.id, amount: 2 }]);

    await screen.findByLabelText('Increase quantity', undefined, { timeout: 3000 });
    await user.click(screen.getByLabelText('Increase quantity'));

    const expectedTotal = (first.price * 3).toFixed(2);
    expect(await screen.findByText(`Total $${expectedTotal}`)).toBeInTheDocument();
  });

  it('shows an empty state when the cart has no items', async () => {
    renderWithStore([]);
    expect(
      await screen.findByText('Your cart is empty', undefined, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
