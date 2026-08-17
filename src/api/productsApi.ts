import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import { products as catalog } from '../data/products';
import type { Product } from '../types';

const SIMULATED_LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const realBaseQuery = API_BASE_URL ? fetchBaseQuery({ baseUrl: API_BASE_URL }) : null;

type ProductsApiArgs =
  | { endpoint: 'getProducts' }
  | { endpoint: 'getProductById'; id: string };

const combinedBaseQuery: BaseQueryFn<
  ProductsApiArgs,
  unknown,
  { status: number; message: string }
> = async (args, api, extraOptions) => {
  if (realBaseQuery) {
    const path =
      args.endpoint === 'getProducts' ? '/products' : `/products/${args.id}`;
    const result = await realBaseQuery(path, api, extraOptions);
    if (result.error) {
      const status =
        typeof result.error.status === 'number' ? result.error.status : 500;
      return { error: { status, message: `Request to ${path} failed` } };
    }
    return { data: result.data };
  }

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
  baseQuery: combinedBaseQuery,
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
