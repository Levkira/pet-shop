import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPage from '../src/pages/CheckoutPage';
import { useAppDispatch } from '../src/hooks';
import { clearCart } from '../src/features/cart/cartSlice';
import { useCartRows } from '../src/features/cart/useCartRows';

vi.mock('../src/hooks', () => ({
  useAppDispatch: vi.fn(),
}));
vi.mock('../src/features/cart/cartSlice', () => ({
  clearCart: vi.fn(() => ({ type: 'cart/clear' })),
}));
vi.mock('../src/features/cart/useCartRows', () => ({
  useCartRows: vi.fn(),
}));
vi.mock('../src/components/Seo', () => ({
  default: () => null,
}));

const mockedUseAppDispatch = vi.mocked(useAppDispatch);
const mockedUseCartRows = vi.mocked(useCartRows);

function renderCheckout() {
  render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>
  );
}

const validValues = {
  fullName: 'Jane Appleseed',
  email: 'jane@example.com',
  address: '123 Bark Ave',
  cardNumber: '4242 4242 4242 4242',
  expiry: '09/27',
};

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('Jane Appleseed'), validValues.fullName);
  await user.type(screen.getByPlaceholderText('jane@example.com'), validValues.email);
  await user.type(screen.getByPlaceholderText('123 Bark Ave'), validValues.address);
  await user.type(
    screen.getByPlaceholderText('4242 4242 4242 4242'),
    validValues.cardNumber
  );
  await user.type(screen.getByPlaceholderText('MM/YY'), validValues.expiry);
}

describe('CheckoutPage', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    dispatch.mockClear();
    vi.mocked(clearCart).mockClear();
    mockedUseAppDispatch.mockReturnValue(dispatch);
  });

  it('shows a "nothing to check out" message when the cart is empty', () => {
    mockedUseCartRows.mockReturnValue({ rows: [], total: 0, isLoading: false } as any);
    renderCheckout();
    expect(screen.getByText('Nothing to check out')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to products/i })).toHaveAttribute(
      'href',
      '/products'
    );
  });

  it('renders the item count and total for a non-empty cart', () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'a', amount: 1 }, product: {} }],
      total: 16.99,
      isLoading: false,
    } as any);
    renderCheckout();
    expect(screen.getByText('1 item')).toBeInTheDocument();
    expect(screen.getByText('$16.99')).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'a', amount: 1 }, product: {} }],
      total: 16.99,
      isLoading: false,
    } as any);
    const user = userEvent.setup();
    renderCheckout();
    await user.click(screen.getByRole('button', { name: /place order/i }));
    expect(await screen.findByText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('places an order, clears the cart, and shows a confirmation on valid submission', async () => {
    vi.useFakeTimers();
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'a', amount: 1 }, product: {} }],
      total: 16.99,
      isLoading: false,
    } as any);
    renderCheckout();

    fireEvent.change(screen.getByPlaceholderText('Jane Appleseed'), {
      target: { value: validValues.fullName },
    });
    fireEvent.change(screen.getByPlaceholderText('jane@example.com'), {
      target: { value: validValues.email },
    });
    fireEvent.change(screen.getByPlaceholderText('123 Bark Ave'), {
      target: { value: validValues.address },
    });
    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), {
      target: { value: validValues.cardNumber },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), {
      target: { value: validValues.expiry },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /place order/i }));
    });

    expect(screen.getByRole('button', { name: /placing order/i })).toBeDisabled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(900);
    });

    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'cart/clear' });
    expect(screen.getByText('Order placed!')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
