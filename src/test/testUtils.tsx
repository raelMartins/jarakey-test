import { cleanup, render, screen, waitFor, type RenderResult } from '@testing-library/react';
import { expect } from 'vitest';
import { createApiClient, type ApiClient } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { AppProviders } from '../context/AppProviders';

export function renderApp(client: ApiClient = createApiClient({ delayMs: 0 })): RenderResult {
  return render(
    <AppProviders client={client}>
      <AppLayout />
    </AppProviders>,
  );
}

export function readPropertyIdHeader(init?: RequestInit): string | undefined {
  return new Headers(init?.headers).get('X-Property-ID') ?? undefined;
}

export function resolveFetchUrl(input: RequestInfo | URL): URL {
  if (input instanceof URL) {
    return input;
  }
  if (typeof input === 'string') {
    return new URL(input);
  }
  return new URL(input.url);
}

export async function waitForPropertiesToLoad(): Promise<void> {
  await waitFor(() => {
    expect(screen.getAllByRole('button', { name: /select property/i }).length).toBeGreaterThan(0);
  });
}

export function getPropertyPickerRegion() {
  return screen.getByRole('region', { name: /your properties/i });
}

export { cleanup };
