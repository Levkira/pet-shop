import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard';
import type { Product } from '../src/types';

vi.mock('../src/components/Rating', () => ({
  default: ({ rating, reviewCount }: { rating: number; reviewCount?: number }) => (
    <div data-testid="rating">
      {rating}
      {reviewCount !== undefined ? ` (${reviewCount})` : ''}
    </div>
  ),
}));

const product: Product = {
  id: 'scratcher',
  imageUrl: '/images/scratcher.jpg',
  title: 'Scratcher',
  price: 19.99,
  description: 'A great scratcher for cats.',
  rating: 4.6,
  reviewCount: 128,
  reviews: [],
};

function renderCard(onAddToCart = vi.fn()) {
  render(
    <MemoryRouter>
      <ProductCard product={product} onAddToCart={onAddToCart} />
    </MemoryRouter>
  );
  return { onAddToCart };
}

describe('ProductCard', () => {
  it('renders product title, price, and description', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: 'Scratcher' })).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText(/great scratcher for cats/i)).toBeInTheDocument();
  });

  it('links the title and image to the product detail page', () => {
    renderCard();
    const links = screen.getAllByRole('link', { name: /scratcher/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/products/scratcher');
    });
  });

  it('calls onAddToCart with the product id when the button is clicked', async () => {
    const user = userEvent.setup();
    const { onAddToCart } = renderCard();
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith('scratcher');
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it('renders the rating component with the product rating and review count', () => {
    renderCard();
    expect(screen.getByTestId('rating')).toHaveTextContent('4.6 (128)');
  });
});
