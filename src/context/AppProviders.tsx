import type { ReactNode } from 'react';
import { PropertyProvider } from './PropertyContext';
import { ToastProvider } from './ToastContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PropertyProvider>{children}</PropertyProvider>
    </ToastProvider>
  );
}
