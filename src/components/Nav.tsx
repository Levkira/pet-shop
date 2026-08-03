import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../hooks';

export default function Nav() {
  const cartCount = useAppSelector((state) =>
    state.cart.reduce((sum, item) => sum + item.amount, 0)
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-ink' : 'text-ink/50 hover:text-ink'
    }`;

  return (
    <header className="border-b border-ink/10 bg-cream">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <NavLink to="/" className="font-display text-xl text-forest">
          Pet Shop
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ''}
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
