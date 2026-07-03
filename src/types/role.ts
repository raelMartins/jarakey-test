export type Role = 'Manager' | 'Tenant';

export interface PropertyRole {
  propertyId: string;
  role: Role;
}
