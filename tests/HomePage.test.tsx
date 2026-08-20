import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import { useGetProductsQuery } from '../src/api/productsApi';
import { useAppDispatch } from '../src/hooks';
import { addToCart } from '../src/features/cart/cartSlice';
import { showToast } from '../src/features/ui/uiSlice';
import type { Product } from '../src/types';

vi.mock('../src/api/productsApi', () => ({
  useGetProductsQuery: vi.fn(),
}));
vi.mock('../src/hooks', () => ({
  useAppDispatch: vi.fn(),
}));
vi.mock('../src/features/cart/cartSlice', () => ({
  addToCart: vi.fn((id: string) => ({ type: 'cart/addToCart', payload: id })),
}));
vi.mock('../src/features/ui/uiSlice', () => ({
  showToast: vi.fn((message: string) => ({ type: 'ui/showToast', payload: message })),
}));
vi.mock('../src/components/ProductCard', () => ({
  default: ({ product, onAddToCart }: any) => (
    <div>
      <span>{product.title}</span>
      <button onClick={() => onAddToCart(product.id)}>Add {product.title}</button>
    </div>
  ),
}));
vi.mock('../src/components/ProductCardSkeleton', () => ({
  default: () => <div data-testid="skeleton" />,
}));
vi.mock('../src/components/Seo', () => ({
  default: () => null,
}));

const mockedUseGetProductsQuery = vi.mocked(useGetProductsQuery);
const mockedUseAppDispatch = vi.mocked(useAppDispatch);

const products: Product[] = [
  {
    id: 'tunnel',
    imageUrl: '/images/cat_tunnel.jpg',
    title: 'Tunnel',
    price: 16.99,
    description: 'A tunnel',
    rating: 4.8,
    reviewCount: 211,
    reviews: [],
  },
  {
    id: 'scratcher',
    imageUrl: '/images/scratcher.jpg',
    title: 'Scratcher',
    price: 19.99,
    description: 'A scratcher',
    rating: 4.6,
    reviewCount: 128,
    reviews: [],
  },
  {
    id: 'dog-bed',
    imageUrl: '/images/dog_bed.png',
    title: 'Dog Bed',
    price: 29.99,
    description: 'A bed',
    rating: 4.5,
    reviewCount: 78,
    reviews: [],
  },
  {
    id: 'house-stool',
    imageUrl: '/images/cat_house_bed_stool.jpg',
    title: 'House Stool',
    price: 48.99,
    description: 'A stool',
    rating: 4.0,
    reviewCount: 37,
    reviews: [],
  },
];

function renderHome() {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    dispatch.mockClear();
    vi.mocked(addToCart).mockClear();
    vi.mocked(showToast).mockClear();
    mockedUseAppDispatch.mockReturnValue(dispatch);
  });

  it('shows skeleton cards while loading', () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);
    renderHome();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('shows an error message when the request fails', () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);
    renderHome();
    expect(screen.getByText(/couldn't load featured products/i)).toBeInTheDocument();
  });

  it('renders only the top 3 highest-rated products as featured', () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: products,
      isLoading: false,
      isError: false,
    } as any);
    renderHome();
    expect(screen.getByText('Tunnel')).toBeInTheDocument();
    expect(screen.getByText('Scratcher')).toBeInTheDocument();
    expect(screen.getByText('Dog Bed')).toBeInTheDocument();
    expect(screen.queryByText('House Stool')).not.toBeInTheDocument();
  });

  it('shows the average rating and total review count', () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: products,
      isLoading: false,
      isError: false,
    } as any);
    renderHome();
    const avg = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(
      1
    );
    const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
    expect(
      screen.getByText(`★ ${avg} average rating from ${totalReviews} reviews`)
    ).toBeInTheDocument();
  });

  it('dispatches addToCart and a toast when a featured product is added', async () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: products,
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole('button', { name: 'Add Tunnel' }));
    expect(addToCart).toHaveBeenCalledWith('tunnel');
    expect(showToast).toHaveBeenCalledWith('Added "Tunnel" to your cart');
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
