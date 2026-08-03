import { useAppSelector } from '../../hooks';
import { useGetProductsQuery } from '../../api/productsApi';
import type { CartItem, Product } from '../../types';

export interface CartRow {
  item: CartItem;
  product: Product;
}

export function useCartRows() {
  const inCart = useAppSelector((state) => state.cart);
  const { data: products = [], isLoading } = useGetProductsQuery();

  const rows: CartRow[] = inCart.flatMap((item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? [{ item, product }] : [];
  });

  const total = rows.reduce(
    (sum, { item, product }) => sum + product.price * item.amount,
    0
  );

  return { rows, total, isLoading };
}
