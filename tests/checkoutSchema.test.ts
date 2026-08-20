import { describe, it, expect } from 'vitest';
import { checkoutSchema } from '../src/pages/checkoutSchema';

const validPayload = {
  fullName: 'Jane Appleseed',
  email: 'jane@example.com',
  address: '123 Bark Ave',
  cardNumber: '4242 4242 4242 4242',
  expiry: '09/27',
};

describe('checkoutSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = checkoutSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('trims and requires a full name of at least 2 characters', () => {
    expect(checkoutSchema.safeParse({ ...validPayload, fullName: ' J' }).success).toBe(
      true
    );
    expect(checkoutSchema.safeParse({ ...validPayload, fullName: ' J ' }).success).toBe(
      true
    );
    expect(checkoutSchema.safeParse({ ...validPayload, fullName: 'J' }).success).toBe(
      false
    );
  });

  it('rejects an invalid email address', () => {
    const result = checkoutSchema.safeParse({ ...validPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('requires an address of at least 5 characters', () => {
    expect(checkoutSchema.safeParse({ ...validPayload, address: '123' }).success).toBe(
      false
    );
  });

  it.each([
    ['4242424242424242', true],
    ['4242 4242 4242 4242', true],
    ['4242-4242-4242-4242', true],
    ['1234', false],
    ['not a card number', false],
  ])('validates card number %s -> %s', (cardNumber, expected) => {
    const result = checkoutSchema.safeParse({ ...validPayload, cardNumber });
    expect(result.success).toBe(expected);
  });

  it.each([
    ['09/27', true],
    ['12/99', true],
    ['13/27', false],
    ['00/27', false],
    ['9/27', false],
  ])('validates expiry %s -> %s', (expiry, expected) => {
    const result = checkoutSchema.safeParse({ ...validPayload, expiry });
    expect(result.success).toBe(expected);
  });
});
