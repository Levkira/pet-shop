import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CartPage from '../src/pages/CartPage';
import { useAppDispatch } from '../src/hooks';
import { removeFromCart, changeAmount } from '../src/features/cart/cartSlice';
import { useCartRows } from '../src/features/cart/useCartRows';
import type { Product } from '../src/types';

vi.mock('../src/hooks', () => ({
  useAppDispatch: vi.fn(),
}));
vi.mock('../src/features/cart/cartSlice', () => ({
  removeFromCart: vi.fn((id: string) => ({ type: 'cart/remove', payload: id })),
  changeAmount: vi.fn((payload: any) => ({ type: 'cart/changeAmount', payload })),
}));
vi.mock('../src/features/cart/useCartRows', () => ({
  useCartRows: vi.fn(),
}));
vi.mock('../src/components/CartList', () => ({
  default: ({ product, amount, onRemove, onIncrease, onDecrease }: any) => (
    <li>
      <span>{product.title}</span>
      <span>Qty {amount}</span>
      <button onClick={onIncrease}>+ {product.title}</button>
      <button onClick={onDecrease}>- {product.title}</button>
      <button onClick={onRemove}>Remove {product.title}</button>
    </li>
  ),
}));
vi.mock('../src/components/Seo', () => ({
  default: () => null,
}));

const mockedUseAppDispatch = vi.mocked(useAppDispatch);
const mockedUseCartRows = vi.mocked(useCartRows);

const product: Product = {
  id: 'tunnel',
  imageUrl: '/images/cat_tunnel.jpg',
  title: 'Tunnel',
  price: 16.99,
  description: 'A tunnel',
  rating: 4.8,
  reviewCount: 211,
  reviews: [],
};

function renderCartPage() {
  render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>
  );
}

describe('CartPage', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    dispatch.mockClear();
    vi.mocked(removeFromCart).mockClear();
    vi.mocked(changeAmount).mockClear();
    mockedUseAppDispatch.mockReturnValue(dispatch);
  });

  it('shows a loading message while cart rows are resolving', () => {
    mockedUseCartRows.mockReturnValue({ rows: [], total: 0, isLoading: true } as any);
    renderCartPage();
    expect(screen.getByText(/loading your cart/i)).toBeInTheDocument();
  });

  it('shows an empty-cart message with a link to products when there are no rows', () => {
    mockedUseCartRows.mockReturnValue({ rows: [], total: 0, isLoading: false } as any);
    renderCartPage();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse products/i })).toHaveAttribute(
      'href',
      '/products'
    );
  });

  it('renders cart rows and the running total', () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'tunnel', amount: 2 }, product }],
      total: 33.98,
      isLoading: false,
    } as any);
    renderCartPage();
    expect(screen.getByText('Tunnel')).toBeInTheDocument();
    expect(screen.getByText('Qty 2')).toBeInTheDocument();
    expect(screen.getByText('Total $33.98')).toBeInTheDocument();
  });

  it('links to the checkout page', () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'tunnel', amount: 1 }, product }],
      total: 16.99,
      isLoading: false,
    } as any);
    renderCartPage();
    expect(screen.getByRole('link', { name: /checkout/i })).toHaveAttribute(
      'href',
      '/checkout'
    );
  });

  it('dispatches changeAmount with amount + 1 when increasing', async () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'tunnel', amount: 2 }, product }],
      total: 33.98,
      isLoading: false,
    } as any);
    const user = userEvent.setup();
    renderCartPage();
    await user.click(screen.getByRole('button', { name: '+ Tunnel' }));
    expect(changeAmount).toHaveBeenCalledWith({ id: 'tunnel', amount: 3 });
  });

  it('dispatches changeAmount with amount - 1 when decreasing', async () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'tunnel', amount: 2 }, product }],
      total: 33.98,
      isLoading: false,
    } as any);
    const user = userEvent.setup();
    renderCartPage();
    await user.click(screen.getByRole('button', { name: '- Tunnel' }));
    expect(changeAmount).toHaveBeenCalledWith({ id: 'tunnel', amount: 1 });
  });

  it('dispatches removeFromCart with the item id when removing', async () => {
    mockedUseCartRows.mockReturnValue({
      rows: [{ item: { id: 'tunnel', amount: 1 }, product }],
      total: 16.99,
      isLoading: false,
    } as any);
    const user = userEvent.setup();
    renderCartPage();
    await user.click(screen.getByRole('button', { name: 'Remove Tunnel' }));
    expect(removeFromCart).toHaveBeenCalledWith('tunnel');
  });
});
