import type { ReactNode } from 'react';
import type { ApiClient } from '../api/client';
import { PropertyProvider } from './PropertyContext';
import { ToastProvider } from './ToastContext';

interface AppProvidersProps {
  children: ReactNode;
  client?: ApiClient;
}

export function AppProviders({ children, client }: AppProvidersProps) {
  return (
    <ToastProvider>
      <PropertyProvider client={client}>{children}</PropertyProvider>
    </ToastProvider>
  );
}
