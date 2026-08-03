import type { ReactNode } from 'react';
import type { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

interface AppProvidersProps {
  store: Store;
  children: ReactNode;
  initialEntries?: string[];
}

export function AppProviders({ store, children, initialEntries }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </HelmetProvider>
    </Provider>
  );
}
