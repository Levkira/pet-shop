import { Link } from 'react-router-dom';
import type { Product } from '../types';
import Rating from './Rating';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-sand"
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 font-mono text-xs text-white shadow">
          ${product.price.toFixed(2)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg text-ink">
          <Link to={`/products/${product.id}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="line-clamp-3 flex-1 text-sm text-ink/60">{product.description}</p>
        <button
          type="button"
          onClick={() => onAddToCart(product.id)}
          className="mt-2 w-full rounded-full bg-mustard px-4 py-2 font-medium text-ink transition-colors hover:bg-mustard/90"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
