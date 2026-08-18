import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { useGetProductByIdQuery } from '../api/productsApi';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import QuantityStepper from '../components/QuantityStepper';
import Rating from '../components/Rating';
import Seo from '../components/Seo';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(id ?? '', {
    skip: !id,
  });
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-sand" />
          <div className="flex flex-col gap-4">
            <div className="h-8 w-2/3 rounded bg-sand" />
            <div className="h-5 w-24 rounded bg-sand" />
            <div className="h-20 w-full rounded bg-sand" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-xl text-ink">Product not found</h1>
        <Link
          to="/products"
          className="mt-4 inline-block text-sm text-forest hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product.id, amount));
    dispatch(
      showToast(
        `Added ${amount} ${amount === 1 ? 'item' : 'items'} of "${product.title}" to your cart`
      )
    );
    setAmount(1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Seo
        title={product.title}
        description={product.description}
        image={product.imageUrl}
      />

      <Link to="/products" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to products
      </Link>
      <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-sand">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-3xl text-ink">{product.title}</h1>
          <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
          <span className="font-mono text-xl text-forest">
            ${product.price.toFixed(2)}
          </span>
          <p className="text-sm leading-relaxed text-ink/70">{product.description}</p>
          <div className="mt-2 flex items-center gap-4">
            <QuantityStepper
              amount={amount}
              onIncrease={() => setAmount((a) => a + 1)}
              onDecrease={() => setAmount((a) => Math.max(1, a - 1))}
            />
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-mustard px-6 py-3 font-medium text-ink transition-colors hover:bg-mustard/90"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-12 border-t border-ink/10 pt-8">
          <h2 className="font-display text-xl text-ink">Reviews</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {product.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl border border-ink/10 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{review.author}</span>
                  <Rating rating={review.rating} />
                </div>
                <p className="mt-2 text-sm text-ink/70">{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
