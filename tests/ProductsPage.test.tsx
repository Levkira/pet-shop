import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductsPage, { PAGE_SIZE } from '../src/pages/ProductsPage';
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

function makeProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i}`,
    imageUrl: `/images/product-${i}.jpg`,
    title: i === 0 ? 'Special Tunnel' : `Product ${i}`,
    price: (i + 1) * 5,
    description: 'A generic product description.',
    rating: (i % 5) + 1,
    reviewCount: i * 10,
    reviews: [],
  }));
}

function renderProductsPage(initialEntries = ['/products']) {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProductsPage />
    </MemoryRouter>
  );
}

describe('ProductsPage', () => {
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
    renderProductsPage();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(6);
  });

  it('shows an error message when the request fails', () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);
    renderProductsPage();
    expect(screen.getByText(/couldn't load products/i)).toBeInTheDocument();
  });

  it('shows a "no products match" message for a search with no results', async () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: makeProducts(3),
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderProductsPage();
    await user.type(screen.getByPlaceholderText('Search products…'), 'zzzznotfound');
    expect(screen.getByText(/no products match "zzzznotfound"/i)).toBeInTheDocument();
  });

  it('filters products by title as the search query changes', async () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: makeProducts(3),
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderProductsPage();
    await user.type(screen.getByPlaceholderText('Search products…'), 'Special');
    expect(screen.getByText('Special Tunnel')).toBeInTheDocument();
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  it(`paginates results at ${PAGE_SIZE} products per page`, async () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: makeProducts(8),
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderProductsPage();

    expect(screen.getAllByRole('button', { name: /^Add /i })).toHaveLength(PAGE_SIZE);

    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(screen.getAllByRole('button', { name: /^Add /i })).toHaveLength(8 - PAGE_SIZE);
  });

  it('sorts by price low to high when that option is selected', async () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: makeProducts(3),
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderProductsPage();
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'price-asc');
    // product-0 ("Special Tunnel") = $5, product-1 = $10, product-2 = $15
    const titles = screen
      .getAllByText(/^(Special Tunnel|Product \d)$/)
      .map((el) => el.textContent);
    expect(titles).toEqual(['Special Tunnel', 'Product 1', 'Product 2']);
  });

  it('dispatches addToCart and a toast when a product is added', async () => {
    mockedUseGetProductsQuery.mockReturnValue({
      data: makeProducts(1),
      isLoading: false,
      isError: false,
    } as any);
    const user = userEvent.setup();
    renderProductsPage();
    await user.click(screen.getByRole('button', { name: 'Add Special Tunnel' }));
    expect(addToCart).toHaveBeenCalledWith('product-0');
    expect(showToast).toHaveBeenCalledWith('Added "Special Tunnel" to your cart');
  });
});
