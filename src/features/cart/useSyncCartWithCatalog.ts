import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useGetProductsQuery } from '../../api/productsApi';
import { removeFromCart } from './cartSlice';

export function useSyncCartWithCatalog() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { data: products } = useGetProductsQuery();

  useEffect(() => {
    if (!products) return;
    const knownIds = new Set(products.map((product) => product.id));
    for (const item of cart) {
      if (!knownIds.has(item.id)) {
        dispatch(removeFromCart(item.id));
      }
    }
  }, [products, cart, dispatch]);
}
