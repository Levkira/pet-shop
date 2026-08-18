import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: {
      reducer: (state, action: PayloadAction<{ id: string; amount: number }>) => {
        const { id, amount } = action.payload;
        const existing = state.find((item) => item.id === id);
        if (existing) {
          existing.amount += amount;
        } else {
          state.unshift({ id, amount });
        }
      },
      prepare: (id: string, amount = 1) => ({ payload: { id, amount } }),
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
    clearCart: () => {
      return [];
    },
    changeAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const item = state.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount = Math.max(1, action.payload.amount);
      }
    },
  },
});

export const { addToCart, removeFromCart, changeAmount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
