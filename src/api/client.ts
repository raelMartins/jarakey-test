import {
  downgradePropertyRole,
  getAllProperties,
  getPropertyById,
  getRoleForProperty,
} from './mockDb';
import {
  transformActionResponse,
  transformDowngradeResponse,
  transformPaginatedProperties,
  transformPropertyRole,
} from './transform';
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

function requirePropertyId(propertyId: string | undefined): string {
  if (!propertyId) {
    throw new ApiError(400, 'X-Property-ID header is required');
  }
  return propertyId;
}

function paginateProperties(page: number, perPage: number): WirePaginatedProperties {
  const all = getAllProperties();
  const start = (page - 1) * perPage;
  const properties = all.slice(start, start + perPage);

  return {
    properties,
    page,
    per_page: perPage,
    total_count: all.length,
  };
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

  async function withDelay<T>(fn: () => T): Promise<T> {
    await simulateDelay(delayMs);
    return fn();
  }

  return {
    async getProperties(params: GetPropertiesParams = {}): Promise<PaginatedProperties> {
      const page = params.page ?? 1;
      const perPage = params.perPage ?? DEFAULT_PAGE_SIZE;
      const wire = await withDelay(() => paginateProperties(page, perPage));
      return transformPaginatedProperties(wire);
    },

    async getPropertyRole(propertyId: string): Promise<PropertyRole> {
      const wire = await withDelay((): WirePropertyRole => {
        const property = getPropertyById(propertyId);
        if (!property) {
          throw new ApiError(404, `Property ${propertyId} not found`);
        }
        return {
          property_id: propertyId,
          role: getRoleForProperty(propertyId),
        };
      });
      return transformPropertyRole(wire);
    },

    async performAction(propertyId: string | undefined): Promise<{ message: string }> {
      const id = requirePropertyId(propertyId);
      const wire = await withDelay((): WireActionResponse => {
        const property = getPropertyById(id);
        if (!property) {
          throw new ApiError(404, `Property ${id} not found`);
        }

        const role = getRoleForProperty(id);
        if (role !== 'Manager') {
          throw new ApiError(403, 'Forbidden: Manager role required');
        }

        return { message: 'Action completed successfully' };
      });
      return transformActionResponse(wire);
    },

    async downgradeRole(propertyId: string | undefined): Promise<PropertyRole> {
      const id = requirePropertyId(propertyId);
      const wire = await withDelay((): WireDowngradeResponse => {
        const property = getPropertyById(id);
        if (!property) {
          throw new ApiError(404, `Property ${id} not found`);
        }

        downgradePropertyRole(id);
        return {
          property_id: id,
          role: 'Tenant',
        };
      });
      return transformDowngradeResponse(wire);
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

/** Default singleton for app use. Tests can call createApiClient() or resetMockDb(). */
export const apiClient = createApiClient();
