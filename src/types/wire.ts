import type { Role } from './role';

/** Raw shapes returned by the mock server (snake_case). Never used in UI code. */
export interface WireProperty {
  property_id: string;
  property_name: string;
  address_line_1: string;
  city: string;
}

export interface WirePaginatedProperties {
  properties: WireProperty[];
  page: number;
  per_page: number;
  total_count: number;
}

export interface WirePropertyRole {
  property_id: string;
  role: Role;
}

export interface WireActionResponse {
  message: string;
}

export interface WireDowngradeResponse {
  property_id: string;
  role: Role;
}
