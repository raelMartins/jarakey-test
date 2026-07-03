import type { Role } from '../types/role';
import type { WireProperty } from '../types/wire';

const MANAGER_PROPERTY_IDS = new Set([
  'prop-001',
  'prop-002',
  'prop-003',
  'prop-004',
  'prop-005',
  'prop-006',
  'prop-007',
]);

const SEED_PROPERTIES: WireProperty[] = [
  { property_id: 'prop-001', property_name: 'Harbor View Apartments', address_line_1: '12 Marina Blvd', city: 'San Diego' },
  { property_id: 'prop-002', property_name: 'Oakwood Residences', address_line_1: '88 Oak Street', city: 'Austin' },
  { property_id: 'prop-003', property_name: 'Summit Heights', address_line_1: '400 Summit Ave', city: 'Denver' },
  { property_id: 'prop-004', property_name: 'Riverside Commons', address_line_1: '15 River Road', city: 'Portland' },
  { property_id: 'prop-005', property_name: 'Lakefront Towers', address_line_1: '220 Lake Shore Dr', city: 'Chicago' },
  { property_id: 'prop-006', property_name: 'Cedar Park Homes', address_line_1: '9 Cedar Lane', city: 'Seattle' },
  { property_id: 'prop-007', property_name: 'Metro Plaza', address_line_1: '101 Main St', city: 'Boston' },
  { property_id: 'prop-008', property_name: 'Willow Creek Estates', address_line_1: '55 Willow Way', city: 'Nashville' },
  { property_id: 'prop-009', property_name: 'Sunset Villas', address_line_1: '300 Sunset Blvd', city: 'Los Angeles' },
  { property_id: 'prop-010', property_name: 'Greenfield Manor', address_line_1: '77 Greenfield Rd', city: 'Charlotte' },
  { property_id: 'prop-011', property_name: 'Pine Ridge Apartments', address_line_1: '14 Pine Ridge Ct', city: 'Phoenix' },
  { property_id: 'prop-012', property_name: 'Brookside Lofts', address_line_1: '62 Brookside Ave', city: 'Minneapolis' },
  { property_id: 'prop-013', property_name: 'Highland Gardens', address_line_1: '18 Highland Park', city: 'Atlanta' },
  { property_id: 'prop-014', property_name: 'Bayfront Suites', address_line_1: '501 Bayfront Pkwy', city: 'Tampa' },
  { property_id: 'prop-015', property_name: 'Elm Street Flats', address_line_1: '33 Elm Street', city: 'Philadelphia' },
];

/** In-memory role overrides (e.g. after /dev/downgrade). Keyed by property_id. */
const roleOverrides = new Map<string, Role>();

function defaultRoleFor(propertyId: string): Role {
  return MANAGER_PROPERTY_IDS.has(propertyId) ? 'Manager' : 'Tenant';
}

export function getAllProperties(): WireProperty[] {
  return [...SEED_PROPERTIES];
}

export function getPropertyById(propertyId: string): WireProperty | undefined {
  return SEED_PROPERTIES.find((p) => p.property_id === propertyId);
}

export function getRoleForProperty(propertyId: string): Role {
  return roleOverrides.get(propertyId) ?? defaultRoleFor(propertyId);
}

export function downgradePropertyRole(propertyId: string): Role {
  roleOverrides.set(propertyId, 'Tenant');
  return 'Tenant';
}

export function upgradePropertyRole(propertyId: string): Role {
  roleOverrides.set(propertyId, 'Manager');
  return 'Manager';
}

export function resetMockDb(): void {
  roleOverrides.clear();
}
