import {
  transformActionResponse,
  transformDowngradeResponse,
  transformPaginatedProperties,
  transformPropertyRole,
} from './transform';
import { MOCK_API_BASE } from './mockFetch';
import type { PaginatedProperties } from '../types/property';
import type { PropertyRole } from '../types/role';
import type {
  WireActionResponse,
  WireDowngradeResponse,
  WirePaginatedProperties,
  WirePropertyRole,
} from '../types/wire';

const DEFAULT_DELAY_MS = 350;
const DEFAULT_PAGE_SIZE = 10;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function simulateDelay(ms = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildHeaders(propertyId?: string): Headers {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (propertyId) {
    headers.set('X-Property-ID', propertyId);
  }
  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new ApiError(response.status, body.error ?? response.statusText);
  }

  return body;
}

export interface GetPropertiesParams {
  page?: number;
  perPage?: number;
}

export interface ApiClientOptions {
  delayMs?: number;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;

  async function withDelay<T>(fn: () => Promise<T>): Promise<T> {
    if (delayMs > 0) {
      await simulateDelay(delayMs);
    }
    return fn();
  }

  return {
    async getProperties(params: GetPropertiesParams = {}): Promise<PaginatedProperties> {
      const page = params.page ?? 1;
      const perPage = params.perPage ?? DEFAULT_PAGE_SIZE;
      const url = `${MOCK_API_BASE}/properties?page=${page}&per_page=${perPage}`;

      const wire = await withDelay(async () => {
        const response = await fetch(url, { method: 'GET', headers: buildHeaders() });
        return parseResponse<WirePaginatedProperties>(response);
      });

      return transformPaginatedProperties(wire);
    },

    async getPropertyRole(propertyId: string): Promise<PropertyRole> {
      const url = `${MOCK_API_BASE}/properties/${propertyId}/role`;

      const wire = await withDelay(async () => {
        const response = await fetch(url, {
          method: 'GET',
          headers: buildHeaders(propertyId),
        });
        return parseResponse<WirePropertyRole>(response);
      });

      return transformPropertyRole(wire);
    },

    async performAction(propertyId: string | undefined): Promise<{ message: string }> {
      if (!propertyId) {
        throw new ApiError(400, 'X-Property-ID header is required');
      }

      const url = `${MOCK_API_BASE}/action`;

      const wire = await withDelay(async () => {
        const response = await fetch(url, {
          method: 'POST',
          headers: buildHeaders(propertyId),
        });
        return parseResponse<WireActionResponse>(response);
      });

      return transformActionResponse(wire);
    },

    async downgradeRole(propertyId: string | undefined): Promise<PropertyRole> {
      if (!propertyId) {
        throw new ApiError(400, 'X-Property-ID header is required');
      }

      const url = `${MOCK_API_BASE}/dev/downgrade`;

      const wire = await withDelay(async () => {
        const response = await fetch(url, {
          method: 'POST',
          headers: buildHeaders(propertyId),
        });
        return parseResponse<WireDowngradeResponse>(response);
      });

      return transformDowngradeResponse(wire);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

export const apiClient = createApiClient();
