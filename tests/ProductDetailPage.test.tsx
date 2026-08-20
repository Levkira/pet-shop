import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '../src/pages/ProductDetailPage';
import { useGetProductByIdQuery } from '../src/api/productsApi';
import { useAppDispatch } from '../src/hooks';
import { addToCart } from '../src/features/cart/cartSlice';
import { showToast } from '../src/features/ui/uiSlice';
import type { Product } from '../src/types';

vi.mock('../src/api/productsApi', () => ({
  useGetProductByIdQuery: vi.fn(),
}));
vi.mock('../src/hooks', () => ({
  useAppDispatch: vi.fn(),
}));
vi.mock('../src/features/cart/cartSlice', () => ({
  addToCart: vi.fn((id: string, amount: number) => ({
    type: 'cart/addToCart',
    payload: { id, amount },
  })),
}));
vi.mock('../src/features/ui/uiSlice', () => ({
  showToast: vi.fn((message: string) => ({ type: 'ui/showToast', payload: message })),
}));
vi.mock('../src/components/QuantityStepper', () => ({
  default: ({
    amount,
    onIncrease,
    onDecrease,
  }: {
    amount: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }) => (
    <div>
      <button onClick={onDecrease}>-</button>
      <span>Qty {amount}</span>
      <button onClick={onIncrease}>+</button>
    </div>
  ),
}));
vi.mock('../src/components/Rating', () => ({
  default: ({ rating }: { rating: number }) => <div>Rating {rating}</div>,
}));
vi.mock('../src/components/Seo', () => ({
  default: () => null,
}));

const mockedUseGetProductByIdQuery = vi.mocked(useGetProductByIdQuery);
const mockedUseAppDispatch = vi.mocked(useAppDispatch);

const product: Product = {
  id: 'tunnel',
  imageUrl: '/images/cat_tunnel.jpg',
  title: 'Tunnel',
  price: 16.99,
  description: 'A great tunnel for cats.',
  rating: 4.8,
  reviewCount: 211,
  reviews: [{ id: 'r1', author: 'Rosa V.', rating: 5, comment: 'Great product!' }],
};

function renderDetail(id = 'tunnel') {
  render(
    <MemoryRouter initialEntries={[`/products/${id}`]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProductDetailPage', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    dispatch.mockClear();
    vi.mocked(addToCart).mockClear();
    vi.mocked(showToast).mockClear();
    mockedUseAppDispatch.mockReturnValue(dispatch);
  });

  it('shows a loading skeleton while fetching', () => {
    mockedUseGetProductByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);
    renderDetail();
    expect(screen.queryByText('Tunnel')).not.toBeInTheDocument();
  });

  it('shows a not-found message when the product errors or is missing', () => {
    mockedUseGetProductByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);
    renderDetail();
    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to products/i })).toHaveAttribute(
      'href',
      '/products'
    );
  });

  it('renders product details, price, and reviews', () => {
    mockedUseGetProductByIdQuery.mockReturnValue({
      data: product,
      isLoading: false,
      isError: false,
    } as any);
    renderDetail();
    expect(screen.getByRole('heading', { name: 'Tunnel' })).toBeInTheDocument();
    expect(screen.getByText('$16.99')).toBeInTheDocument();
    expect(screen.getByText('Rosa V.')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
  });

  it('increments quantity and adds that amount to the cart, then resets to 1', async () => {
    mockedUseGetProductByIdQuery.mockReturnValue({
      data: product,
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderDetail();

    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('Qty 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(addToCart).toHaveBeenCalledWith('tunnel', 3);
    expect(showToast).toHaveBeenCalledWith('Added 3 items of "Tunnel" to your cart');
    expect(screen.getByText('Qty 1')).toBeInTheDocument();
  });

  it('uses singular wording for a single item added to the cart', async () => {
    mockedUseGetProductByIdQuery.mockReturnValue({
      data: product,
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(showToast).toHaveBeenCalledWith('Added 1 item of "Tunnel" to your cart');
  });
});
