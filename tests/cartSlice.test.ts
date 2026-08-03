import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  changeAmount,
  clearCart,
} from '../src/features/cart/cartSlice';

describe('cartReducer', () => {
  it('adds a new product with amount 1', () => {
    const state = cartReducer([], addToCart('p1'));
    expect(state).toEqual([{ id: 'p1', amount: 1 }]);
  });

  it('increments amount when adding a product already in the cart', () => {
    const state = cartReducer([{ id: 'p1', amount: 1 }], addToCart('p1'));
    expect(state).toEqual([{ id: 'p1', amount: 2 }]);
  });

  it('removes a product by id', () => {
    const state = cartReducer(
      [
        { id: 'p1', amount: 1 },
        { id: 'p2', amount: 3 },
      ],
      removeFromCart('p1')
    );
    expect(state).toEqual([{ id: 'p2', amount: 3 }]);
  });

  it('sets the amount for a product', () => {
    const state = cartReducer(
      [{ id: 'p1', amount: 1 }],
      changeAmount({ id: 'p1', amount: 5 })
    );
    expect(state).toEqual([{ id: 'p1', amount: 5 }]);
  });

  it('clamps amount to a minimum of 1 (regression test for the old no-op ternary bug)', () => {
    const zero = cartReducer(
      [{ id: 'p1', amount: 1 }],
      changeAmount({ id: 'p1', amount: 0 })
    );
    expect(zero).toEqual([{ id: 'p1', amount: 1 }]);

    const negative = cartReducer(
      [{ id: 'p1', amount: 1 }],
      changeAmount({ id: 'p1', amount: -3 })
    );
    expect(negative).toEqual([{ id: 'p1', amount: 1 }]);
  });

  it('leaves state untouched when changing the amount for an id not in the cart', () => {
    const state = cartReducer(
      [{ id: 'p1', amount: 1 }],
      changeAmount({ id: 'p2', amount: 5 })
    );
    expect(state).toEqual([{ id: 'p1', amount: 1 }]);
  });

  it('adds a chosen quantity when given (used by the product detail page)', () => {
    const state = cartReducer([], addToCart('p1', 3));
    expect(state).toEqual([{ id: 'p1', amount: 3 }]);
  });

  it('adds the quantity on top of an existing amount', () => {
    const state = cartReducer([{ id: 'p1', amount: 2 }], addToCart('p1', 3));
    expect(state).toEqual([{ id: 'p1', amount: 5 }]);
  });

  it('empties the cart on clearCart (used after checkout)', () => {
    const state = cartReducer(
      [
        { id: 'p1', amount: 1 },
        { id: 'p2', amount: 2 },
      ],
      clearCart()
    );
    expect(state).toEqual([]);
  });
});
