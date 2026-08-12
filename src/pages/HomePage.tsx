import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { useGetProductsQuery } from '../api/productsApi';
import { addToCart } from '../features/cart/cartSlice';
import { showToast } from '../features/ui/uiSlice';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Seo from '../components/Seo';

const TRUST_BADGES = [
  {
    icon: '🚚',
    title: 'Free shipping over $35',
    description: 'Most orders arrive within 3–5 business days.',
  },
  {
    icon: '🔄',
    title: '30-day returns',
    description: "Didn't work out? Send it back, no questions asked.",
  },
  {
    icon: '🐾',
    title: 'Vet-reviewed materials',
    description: 'Every product is checked for pet-safe construction.',
  },
  {
    icon: '💬',
    title: 'Real customer reviews',
    description: 'Ratings from actual pet parents, not marketing copy.',
  },
];

export default function HomePage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const dispatch = useAppDispatch();

  const featured = [...(products ?? [])]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const totalReviews = (products ?? []).reduce((sum, p) => sum + p.reviewCount, 0);
  const averageRating = products?.length
    ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
    : null;

  const handleAddToCart = (id: string) => {
    const product = products?.find((p) => p.id === id);
    dispatch(addToCart(id));
    if (product) {
      dispatch(showToast(`Added "${product.title}" to your cart`));
    }
  };

  return (
    <div>
      <Seo
        title="Home"
        description="Everything you need for your pet — handpicked scratchers, beds, tunnels, and toys, loved by cats and dogs alike."
      />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-rust">
              New season, new favorites
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Everything your pet needs, delivered with love
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              From scratchers to snuggly beds, we handpick every product for
              comfort, durability, and tail-wagging approval. No filler, no
              gimmicks — just things pets actually use, chosen by people who
              live with the same shredded couch corners you do.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="rounded-full bg-mustard px-6 py-3 font-medium text-ink transition-colors hover:bg-mustard/90"
              >
                Shop all products
              </Link>
              {averageRating !== null && (
                <span className="text-sm text-ink/60">
                  ★ {averageRating.toFixed(1)} average rating from{' '}
                  {totalReviews} reviews
                </span>
              )}
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-sand shadow-sm">
            <img
              src="/images/home_image.jpg"
              alt="Happy pets"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-ink/10 bg-white/60">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title} className="text-center sm:text-left">
              <span className="text-2xl" aria-hidden="true">
                {badge.icon}
              </span>
              <h3 className="mt-2 text-sm font-medium text-ink">{badge.title}</h3>
              <p className="mt-1 text-xs text-ink/60">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink">Customer favorites</h2>
            <p className="mt-1 text-sm text-ink/60">
              The products our pet parents can't stop reordering.
            </p>
          </div>
          <Link
            to="/products"
            className="whitespace-nowrap text-sm font-medium text-forest hover:underline"
          >
            View all →
          </Link>
        </div>

        {isError && (
          <p className="rounded-lg bg-rust/10 px-4 py-3 text-sm text-rust">
            Couldn't load featured products right now.
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Brand story */}
      <section className="bg-forest/5">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="font-display text-2xl text-ink">
            Why we started Pet Shop
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            We started Pet Shop after one too many trips to return flimsy,
            mass-produced pet gear that didn't survive a single afternoon.
            Every product here is chosen — and used — by the people who pick
            it, tested against the toughest critics we know: our own cats and
            dogs. If it doesn't earn a spot in our own homes, it doesn't earn
            a spot in the shop.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-forest px-6 py-10 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl">Ready to spoil your pet?</h2>
            <p className="mt-1 text-sm text-white/80">
              Browse the full catalog and find their new favorite thing.
            </p>
          </div>
          <Link
            to="/products"
            className="whitespace-nowrap rounded-full bg-mustard px-6 py-3 font-medium text-ink transition-colors hover:bg-mustard/90"
          >
            Shop now
          </Link>
        </div>
      </section>
    </div>
  );
}
