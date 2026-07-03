import {
  downgradePropertyRole,
  upgradePropertyRole,
  getAllProperties,
  getPropertyById,
  getRoleForProperty,
} from './mockDb';
import type {
  WireActionResponse,
  WireDowngradeResponse,
  WirePaginatedProperties,
  WirePropertyRole,
} from '../types/wire';

export const MOCK_API_BASE = 'http://mock.jarakey.local';

const DEFAULT_PAGE_SIZE = 10;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

function paginateProperties(page: number, perPage: number): WirePaginatedProperties {
  const all = getAllProperties();
  const start = (page - 1) * perPage;

  return {
    properties: all.slice(start, start + perPage),
    page,
    per_page: perPage,
    total_count: all.length,
  };
}

function readPropertyIdHeader(headers: Headers): string | undefined {
  return headers.get('X-Property-ID') ?? undefined;
}

function resolveUrl(input: RequestInfo | URL): URL {
  if (input instanceof URL) {
    return input;
  }
  if (typeof input === 'string') {
    return new URL(input);
  }
  return new URL(input.url);
}

export async function handleMockFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = resolveUrl(input);
  const method = (init?.method ?? 'GET').toUpperCase();
  const headers = new Headers(init?.headers);
  const propertyId = readPropertyIdHeader(headers);

  if (method === 'GET' && url.pathname === '/properties') {
    const page = Number(url.searchParams.get('page') ?? '1');
    const perPage = Number(url.searchParams.get('per_page') ?? String(DEFAULT_PAGE_SIZE));
    return jsonResponse(paginateProperties(page, perPage));
  }

  const roleMatch = url.pathname.match(/^\/properties\/([^/]+)\/role$/);
  if (method === 'GET' && roleMatch) {
    const id = roleMatch[1]!;
    if (!propertyId || propertyId !== id) {
      return errorResponse('X-Property-ID header must match the requested property', 400);
    }

    const property = getPropertyById(id);
    if (!property) {
      return errorResponse(`Property ${id} not found`, 404);
    }

    const body: WirePropertyRole = {
      property_id: id,
      role: getRoleForProperty(id),
    };
    return jsonResponse(body);
  }

  if (method === 'POST' && url.pathname === '/action') {
    if (!propertyId) {
      return errorResponse('X-Property-ID header is required', 400);
    }

    const property = getPropertyById(propertyId);
    if (!property) {
      return errorResponse(`Property ${propertyId} not found`, 404);
    }

    const role = getRoleForProperty(propertyId);
    if (role !== 'Manager') {
      return errorResponse('Forbidden: Manager role required', 403);
    }

    const body: WireActionResponse = { message: 'Action completed successfully' };
    return jsonResponse(body);
  }

  if (method === 'POST' && url.pathname === '/dev/downgrade') {
    if (!propertyId) {
      return errorResponse('X-Property-ID header is required', 400);
    }

    const property = getPropertyById(propertyId);
    if (!property) {
      return errorResponse(`Property ${propertyId} not found`, 404);
    }

    downgradePropertyRole(propertyId);
    const body: WireDowngradeResponse = {
      property_id: propertyId,
      role: 'Tenant',
    };
    return jsonResponse(body);
  }

  if (method === 'POST' && url.pathname === '/dev/upgrade') {
    if (!propertyId) {
      return errorResponse('X-Property-ID header is required', 400);
    }

    const property = getPropertyById(propertyId);
    if (!property) {
      return errorResponse(`Property ${propertyId} not found`, 404);
    }

    upgradePropertyRole(propertyId);
    const body: WireDowngradeResponse = {
      property_id: propertyId,
      role: 'Manager',
    };
    return jsonResponse(body);
  }

  return errorResponse('Not found', 404);
}

export function installMockFetch(): void {
  globalThis.fetch = handleMockFetch;
}
