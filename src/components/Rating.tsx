interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export default function Rating({ rating, reviewCount, size = 'sm' }: RatingProps) {
  const rounded = Math.round(rating);
  const stars = '★★★★★'.slice(0, rounded) + '☆☆☆☆☆'.slice(0, 5 - rounded);

  return (
    <div
      className={`flex items-center gap-1.5 ${size === 'sm' ? 'text-sm' : 'text-base'}`}
      aria-label={`Rated ${rating} out of 5${
        reviewCount !== undefined ? ` from ${reviewCount} reviews` : ''
      }`}
    >
      <span className="tracking-tight text-mustard" aria-hidden="true">
        {stars}
      </span>
      <span className="text-ink/50">
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount})`}
      </span>
    </div>
  );
}
