import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { useGetProductsQuery } from '../api/productsApi';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Pagination from '../components/Pagination';
import Seo from '../components/Seo';
import type { Product } from '../types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Highest rated',
};

export const PAGE_SIZE = 6;

function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get('page'));
  const page = Number.isFinite(requestedPage) && requestedPage >= 1 ? requestedPage : 1;

  const goToPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(nextPage));
      }
      return next;
    });
  };

  const visibleProducts = useMemo(() => {
    if (!products) return [];
    const trimmed = query.trim().toLowerCase();
    const filtered = trimmed
      ? products.filter(
          (product) =>
            product.title.toLowerCase().includes(trimmed) ||
            product.description.toLowerCase().includes(trimmed)
        )
      : products;
    return sortProducts(filtered, sortBy);
  }, [products, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));

  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageProducts = visibleProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    goToPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    goToPage(1);
  };

  const handleAddToCart = (id: string) => {
    const product = products?.find((p) => p.id === id);
    dispatch(addToCart(id));
    if (product) {
      dispatch(showToast(`Added "${product.title}" to your cart`));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Seo
        title="Products"
        description="Browse scratchers, beds, tunnels, and toys for your pet."
      />

      <h1 className="mb-6 font-display text-2xl text-ink">Products</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-full border border-ink/15 bg-white px-4 py-2 text-sm outline-none focus:border-forest sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-ink/70">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => handleSortChange(event.target.value as SortOption)}
            className="rounded-full border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-forest"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isError && (
        <p className="rounded-lg bg-rust/10 px-4 py-3 text-sm text-rust">
          Couldn't load products right now. Please try again in a moment.
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && visibleProducts.length === 0 && (
        <p className="py-12 text-center text-sm text-ink/60">
          No products match "{query}".
        </p>
      )}

      {!isLoading && !isError && visibleProducts.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
