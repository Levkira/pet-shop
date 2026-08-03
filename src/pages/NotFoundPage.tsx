import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <Helmet>
        <title>Page not found | Pet Shop</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <p className="font-display text-2xl text-ink">Page not found</p>
      <p className="mt-2 text-sm text-ink/60">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-mustard px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-mustard/90"
      >
        Back home
      </Link>
    </div>
  );
}
