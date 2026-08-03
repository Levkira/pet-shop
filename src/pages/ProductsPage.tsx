import { useMemo, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { useGetProductsQuery } from '../api/productsApi';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import type { Product } from '../types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Highest rated',
};

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

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="aspect-square bg-sand" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-2/3 rounded bg-sand" />
        <div className="h-3 w-full rounded bg-sand" />
        <div className="h-3 w-5/6 rounded bg-sand" />
        <div className="mt-1 h-9 w-full rounded-full bg-sand" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-full border border-ink/15 bg-white px-4 py-2 text-sm outline-none focus:border-forest sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-ink/70">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
