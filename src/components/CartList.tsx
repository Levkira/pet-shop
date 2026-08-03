import type { Product } from '../types';
import QuantityStepper from './QuantityStepper';

interface CartListProps {
  product: Product;
  amount: number;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function CartList({
  product,
  amount,
  onRemove,
  onIncrease,
  onDecrease,
}: CartListProps) {
  return (
    <li className="flex items-center gap-4 border-b border-ink/10 py-4 last:border-none">
      <img
        src={product.imageUrl}
        alt={product.title}
        loading="lazy"
        className="h-16 w-16 rounded-lg object-cover"
      />
      <span className="flex-1 font-display text-ink">{product.title}</span>
      <QuantityStepper amount={amount} onIncrease={onIncrease} onDecrease={onDecrease} />
      <span className="w-20 text-right font-mono text-sm text-ink/80">
        ${(product.price * amount).toFixed(2)}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.title} from cart`}
        className="text-ink/40 transition-colors hover:text-rust"
      >
        &#10005;
      </button>
    </li>
  );
}
