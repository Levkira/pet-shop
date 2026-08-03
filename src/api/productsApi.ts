import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { products as catalog } from '../data/products';
import type { Product } from '../types';

const SIMULATED_LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

const mockBaseQuery: BaseQueryFn<
  { endpoint: 'getProducts' } | { endpoint: 'getProductById'; id: string },
  unknown,
  { status: number; message: string }
> = async (args) => {
  if (args.endpoint === 'getProducts') {
    return { data: await delay(catalog) };
  }

  const product = catalog.find((p) => p.id === args.id);
  if (!product) {
    return { error: { status: 404, message: `Product ${args.id} not found` } };
  }
  return { data: await delay(product) };
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({ endpoint: 'getProducts' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => ({ endpoint: 'getProductById', id }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
