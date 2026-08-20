import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from '../src/components/Nav';
import { useAppSelector } from '../src/hooks';

vi.mock('../src/hooks', () => ({
  useAppSelector: vi.fn(),
}));

const mockedUseAppSelector = vi.mocked(useAppSelector);

function renderNav() {
  render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>
  );
}

describe('Nav', () => {
  it('renders the Cart link without a count when the cart is empty', () => {
    mockedUseAppSelector.mockImplementation((selector) => selector({ cart: [] } as any));
    renderNav();
    expect(screen.getByRole('link', { name: 'Cart' })).toBeInTheDocument();
  });

  it('shows the total item count in the Cart link', () => {
    mockedUseAppSelector.mockImplementation((selector) =>
      selector({
        cart: [
          { id: 'a', amount: 2 },
          { id: 'b', amount: 3 },
        ],
      } as any)
    );
    renderNav();
    expect(screen.getByRole('link', { name: 'Cart (5)' })).toBeInTheDocument();
  });

  it('renders links to Home, Products, and Cart', () => {
    mockedUseAppSelector.mockImplementation((selector) => selector({ cart: [] } as any));
    renderNav();
    expect(screen.getByRole('link', { name: 'Pet Shop' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute(
      'href',
      '/products'
    );
  });
});
