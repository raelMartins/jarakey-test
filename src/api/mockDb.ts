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

function img(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&h=360&q=80`;
}

const SEED_PROPERTIES: WireProperty[] = [
  { property_id: 'prop-001', property_name: 'Harbor View Apartments', address_line_1: '12 Marina Blvd', city: 'San Diego', image_url: img('photo-1545324418-cc1a3fa10c00') },
  { property_id: 'prop-002', property_name: 'Oakwood Residences', address_line_1: '88 Oak Street', city: 'Austin', image_url: img('photo-1564013799919-ab600027ffc6') },
  { property_id: 'prop-003', property_name: 'Summit Heights', address_line_1: '400 Summit Ave', city: 'Denver', image_url: img('photo-1512917774080-9991f1c4c750') },
  { property_id: 'prop-004', property_name: 'Riverside Commons', address_line_1: '15 River Road', city: 'Portland', image_url: img('photo-1580587771525-78b9dba3b914') },
  { property_id: 'prop-005', property_name: 'Lakefront Towers', address_line_1: '220 Lake Shore Dr', city: 'Chicago', image_url: img('photo-1486406146926-c627a92ad1ab') },
  { property_id: 'prop-006', property_name: 'Cedar Park Homes', address_line_1: '9 Cedar Lane', city: 'Seattle', image_url: img('photo-1600596542815-ffad4c1539a9') },
  { property_id: 'prop-007', property_name: 'Metro Plaza', address_line_1: '101 Main St', city: 'Boston', image_url: img('photo-1600607687939-ce8a6c25118c') },
  { property_id: 'prop-008', property_name: 'Willow Creek Estates', address_line_1: '55 Willow Way', city: 'Nashville', image_url: img('photo-1759277700809-2b544c0f4261') },
  { property_id: 'prop-009', property_name: 'Sunset Villas', address_line_1: '300 Sunset Blvd', city: 'Los Angeles', image_url: img('photo-1493809842364-78817add7ffb') },
  { property_id: 'prop-010', property_name: 'Greenfield Manor', address_line_1: '77 Greenfield Rd', city: 'Charlotte', image_url: img('photo-1612637968894-660373e23b03') },
  { property_id: 'prop-011', property_name: 'Pine Ridge Apartments', address_line_1: '14 Pine Ridge Ct', city: 'Phoenix', image_url: img('photo-1779006887650-dc704c67bbac') },
  { property_id: 'prop-012', property_name: 'Brookside Lofts', address_line_1: '62 Brookside Ave', city: 'Minneapolis', image_url: img('photo-1770279726839-f537f21c6d32') },
  { property_id: 'prop-013', property_name: 'Highland Gardens', address_line_1: '18 Highland Park', city: 'Atlanta', image_url: img('photo-1560518883-ce09059eeffa') },
  { property_id: 'prop-014', property_name: 'Bayfront Suites', address_line_1: '501 Bayfront Pkwy', city: 'Tampa', image_url: img('photo-1502672260266-1c1ef2d93688') },
  { property_id: 'prop-015', property_name: 'Elm Street Flats', address_line_1: '33 Elm Street', city: 'Philadelphia', image_url: img('photo-1600607687644-c7171b42498f') },
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
