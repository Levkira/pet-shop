import { createSlice } from '@reduxjs/toolkit';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';

const productsSlice = createSlice({
  name: 'products',
  initialState: initialProducts as Product[],
  reducers: {},
});

export default productsSlice.reducer;
