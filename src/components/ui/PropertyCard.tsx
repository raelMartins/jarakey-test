import type { Property } from '../../types/property';
import type { Role } from '../../types/role';
import { CheckmarkIcon, PropertyImage, RoleBadge } from './PropertyMedia';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isActive?: boolean;
  role?: Role | null;
}

export function PropertyCard({ property, onSelect, isActive = false, role }: PropertyCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={`Select ${property.propertyName}`}
      onClick={() => onSelect(property)}
      className={`group relative w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        isActive
          ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
          : 'border-slate-200/80 hover:border-emerald-300'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <PropertyImage
          src={property.imageUrl}
          alt={property.propertyName}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        {isActive && (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <CheckmarkIcon />
          </span>
        )}

        {role && (
          <div className="absolute bottom-2 left-2">
            <RoleBadge role={role} />
          </div>
        )}
      </div>

      <div className="space-y-0.5 p-3.5">
        <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-900">
          {property.propertyName}
        </h3>
        <p className="truncate text-xs text-slate-500">
          {property.addressLine1}, {property.city}
        </p>
      </div>
    </button>
  );
}
