import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import { productsApi } from '../src/api/productsApi';
import { products } from '../src/data/products';
import CheckoutPage from '../src/pages/CheckoutPage';
import { AppProviders } from './test-utils';

function renderWithStore() {
  const store = configureStore({
    reducer: { cart: cartReducer, [productsApi.reducerPath]: productsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState: { cart: [{ id: products[0].id, amount: 2 }] },
  });
  render(
    <AppProviders store={store}>
      <CheckoutPage />
    </AppProviders>
  );
  return store;
}

describe('CheckoutPage', () => {
  it('shows an order confirmation and empties the cart after placing a valid order', async () => {
    const store = renderWithStore();

    await screen.findByLabelText('Full name', undefined, { timeout: 3000 });

    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: 'Jane Appleseed' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Shipping address'), {
      target: { value: '123 Bark Ave' },
    });
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242 4242 4242 4242' },
    });
    fireEvent.change(screen.getByLabelText('Expiry'), {
      target: { value: '12/30' },
    });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    expect(
      await screen.findByText('Order placed!', undefined, { timeout: 3000 })
    ).toBeInTheDocument();
    expect(store.getState().cart).toEqual([]);
  });

  it('shows validation errors instead of submitting when fields are invalid', async () => {
    renderWithStore();

    await screen.findByLabelText('Full name', undefined, { timeout: 3000 });
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: 'not-a-card' },
    });
    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByText('Enter your full name')).toBeInTheDocument();
    expect(await screen.findByText('Enter a valid card number')).toBeInTheDocument();
    expect(screen.queryByText('Order placed!')).not.toBeInTheDocument();
  });
});
