import { useState } from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../hooks';
import { clearCart } from '../features/cart/cartSlice';
import { useCartRows } from '../features/cart/useCartRows';
import { checkoutSchema, type CheckoutFormValues } from './checkoutSchema';
import Seo from '../components/Seo';

type Status = 'form' | 'processing' | 'confirmed';

const inputClass =
  'rounded-lg border px-3 py-2 outline-none focus:border-forest border-ink/15 aria-[invalid=true]:border-rust';

export default function CheckoutPage() {
  const { rows, total } = useCartRows();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<Status>('form');
  const [orderNumber, setOrderNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
  });

  const onSubmit = () => {
    setStatus('processing');
    // Mock payment processing — no real gateway is wired up here. A short
    // delay just makes the "Placing order…" state visible.
    setTimeout(() => {
      setOrderNumber(nanoid(8).toUpperCase());
      dispatch(clearCart());
      setStatus('confirmed');
    }, 900);
  };

  if (status === 'confirmed') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Seo title="Order confirmed" description="Your order has been placed." />
        <h1 className="font-display text-2xl text-ink">Order placed!</h1>
        <p className="mt-2 text-sm text-ink/60">
          Order <span className="font-mono text-ink">#{orderNumber}</span> is
          confirmed. This is a mock checkout, so no payment was actually
          taken.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-mustard px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-mustard/90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-xl text-ink">Nothing to check out</h1>
        <Link
          to="/products"
          className="mt-4 inline-block text-sm text-forest hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Seo title="Checkout" description="Complete your mock order." />
      <h1 className="font-display text-2xl text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-ink/60">
        This is a mock checkout — no real payment is processed.
      </p>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-4">
        <div className="flex justify-between text-sm text-ink/70">
          <span>
            {rows.length} item{rows.length === 1 ? '' : 's'}
          </span>
          <span className="font-mono">${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink/80">
          Full name
          <input
            {...register('fullName')}
            type="text"
            placeholder="Jane Appleseed"
            aria-invalid={!!errors.fullName}
            className={inputClass}
          />
          {errors.fullName && (
            <span className="text-xs text-rust">{errors.fullName.message}</span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink/80">
          Email
          <input
            {...register('email')}
            type="email"
            placeholder="jane@example.com"
            aria-invalid={!!errors.email}
            className={inputClass}
          />
          {errors.email && (
            <span className="text-xs text-rust">{errors.email.message}</span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink/80">
          Shipping address
          <input
            {...register('address')}
            type="text"
            placeholder="123 Bark Ave"
            aria-invalid={!!errors.address}
            className={inputClass}
          />
          {errors.address && (
            <span className="text-xs text-rust">{errors.address.message}</span>
          )}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm text-ink/80">
            Card number
            <input
              {...register('cardNumber')}
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              aria-invalid={!!errors.cardNumber}
              className={`${inputClass} font-mono`}
            />
            {errors.cardNumber && (
              <span className="text-xs text-rust">{errors.cardNumber.message}</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink/80">
            Expiry
            <input
              {...register('expiry')}
              type="text"
              placeholder="MM/YY"
              aria-invalid={!!errors.expiry}
              className={`${inputClass} font-mono`}
            />
            {errors.expiry && (
              <span className="text-xs text-rust">{errors.expiry.message}</span>
            )}
          </label>
        </div>
        <button
          type="submit"
          disabled={status === 'processing'}
          className="mt-2 rounded-full bg-forest px-6 py-3 font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-60"
        >
          {status === 'processing'
            ? 'Placing order…'
            : `Place order — $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
