import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { removeFromCart, changeAmount } from '../features/cart/cartSlice';
import { useCartRows } from '../features/cart/useCartRows';
import CartList from '../components/CartList';
import Seo from '../components/Seo';

export default function CartPage() {
  const { rows, total, isLoading } = useCartRows();
  const dispatch = useAppDispatch();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-ink/50">
        Loading your cart…
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Seo title="Cart" description="Review the items in your cart." />
        <p className="font-display text-xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-ink/60">
          Add a few things from the products page to see them here.
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-full bg-mustard px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-mustard/90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Seo title="Cart" description="Review the items in your cart." />
      <ul>
        {rows.map(({ item, product }) => (
          <CartList
            key={item.id}
            product={product}
            amount={item.amount}
            onRemove={() => dispatch(removeFromCart(item.id))}
            onIncrease={() =>
              dispatch(changeAmount({ id: item.id, amount: item.amount + 1 }))
            }
            onDecrease={() =>
              dispatch(changeAmount({ id: item.id, amount: item.amount - 1 }))
            }
          />
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-xl text-ink">
          Total ${total.toFixed(2)}
        </span>
        <Link
          to="/checkout"
          className="rounded-full bg-forest px-6 py-2 font-medium text-white transition-colors hover:bg-forest/90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
