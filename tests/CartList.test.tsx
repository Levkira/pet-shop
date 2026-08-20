import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartList from '../src/components/CartList';
import type { Product } from '../src/types';

vi.mock('../src/components/QuantityStepper', () => ({
  default: ({
    amount,
    onIncrease,
    onDecrease,
  }: {
    amount: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }) => (
    <div>
      <button type="button" onClick={onDecrease}>
        -
      </button>
      <span>{amount}</span>
      <button type="button" onClick={onIncrease}>
        +
      </button>
    </div>
  ),
}));

const product: Product = {
  id: 'dog-bed',
  imageUrl: '/images/dog_bed.png',
  title: 'Dog Bed',
  price: 29.99,
  description: 'A comfy bed.',
  rating: 4.5,
  reviewCount: 78,
  reviews: [],
};

describe('CartList', () => {
  it('renders the product title and line total', () => {
    render(
      <ul>
        <CartList
          product={product}
          amount={2}
          onRemove={vi.fn()}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      </ul>
    );
    expect(screen.getByText('Dog Bed')).toBeInTheDocument();
    expect(screen.getByText('$59.98')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onIncrease and onDecrease from the quantity stepper', async () => {
    const user = userEvent.setup();
    const onIncrease = vi.fn();
    const onDecrease = vi.fn();
    render(
      <ul>
        <CartList
          product={product}
          amount={1}
          onRemove={vi.fn()}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      </ul>
    );
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '-' }));
    expect(onIncrease).toHaveBeenCalledTimes(1);
    expect(onDecrease).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <ul>
        <CartList
          product={product}
          amount={1}
          onRemove={onRemove}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      </ul>
    );
    await user.click(screen.getByRole('button', { name: /remove dog bed from cart/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('recalculates the line total as amount changes across renders', () => {
    const { rerender } = render(
      <ul>
        <CartList
          product={product}
          amount={1}
          onRemove={vi.fn()}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      </ul>
    );
    expect(screen.getByText('$29.99')).toBeInTheDocument();

    rerender(
      <ul>
        <CartList
          product={product}
          amount={3}
          onRemove={vi.fn()}
          onIncrease={vi.fn()}
          onDecrease={vi.fn()}
        />
      </ul>
    );
    expect(screen.getByText('$89.97')).toBeInTheDocument();
  });
});
