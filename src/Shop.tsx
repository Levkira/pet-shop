import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Toast from './components/Toast';
import { useSyncCartWithCatalog } from './features/cart/useSyncCartWithCatalog';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function Shop() {
  useSyncCartWithCatalog();

  return (
    <div className="min-h-screen bg-cream">
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toast />
    </div>
  );
}
