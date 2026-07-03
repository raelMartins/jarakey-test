import type { PaginatedProperties, Property } from '../types/property';
import type { PropertyRole } from '../types/role';
import type {
  WireActionResponse,
  WireDowngradeResponse,
  WirePaginatedProperties,
  WireProperty,
  WirePropertyRole,
} from '../types/wire';

function transformProperty(wire: WireProperty): Property {
  return {
    propertyId: wire.property_id,
    propertyName: wire.property_name,
    addressLine1: wire.address_line_1,
    city: wire.city,
  };
}

export function transformPaginatedProperties(
  wire: WirePaginatedProperties,
): PaginatedProperties {
  return {
    properties: wire.properties.map(transformProperty),
    page: wire.page,
    perPage: wire.per_page,
    totalCount: wire.total_count,
  };
}

export function transformPropertyRole(wire: WirePropertyRole): PropertyRole {
  return {
    propertyId: wire.property_id,
    role: wire.role,
  };
}

export function transformActionResponse(wire: WireActionResponse): { message: string } {
  return { message: wire.message };
}

export function transformDowngradeResponse(
  wire: WireDowngradeResponse,
): PropertyRole {
  return {
    propertyId: wire.property_id,
    role: wire.role,
  };
}
