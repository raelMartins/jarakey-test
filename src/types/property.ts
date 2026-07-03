export interface Property {
  propertyId: string;
  propertyName: string;
  addressLine1: string;
  city: string;
}

export interface PaginatedProperties {
  properties: Property[];
  page: number;
  perPage: number;
  totalCount: number;
}
