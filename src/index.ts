export type { Property, PaginatedProperties } from './types/property';
export type { Role, PropertyRole } from './types/role';
export { apiClient, createApiClient, ApiError } from './api/client';
export type { ApiClient, GetPropertiesParams } from './api/client';
export { resetMockDb } from './api/mockDb';
