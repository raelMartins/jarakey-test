import type { Property } from '../../types/property';
import type { Role } from '../../types/role';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  isActive?: boolean;
  role?: Role | null;
}

const roleBadgeStyles: Record<Role, string> = {
  Manager: 'bg-emerald-100 text-emerald-800',
  Tenant: 'bg-slate-100 text-slate-600',
};

export function PropertyCard({ property, onSelect, isActive = false, role }: PropertyCardProps) {
  return (
    <article
      className={`group rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md ${
        isActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-emerald-900">
            {property.propertyName}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{property.addressLine1}</p>
          <p className="mt-0.5 text-sm text-slate-400">{property.city}</p>
        </div>

        {role && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${roleBadgeStyles[role]}`}
          >
            {role}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={isActive}
        onClick={() => onSelect(property.propertyId)}
        className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-800 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-default disabled:bg-emerald-800/80 disabled:hover:bg-emerald-800/80 disabled:hover:shadow-sm sm:w-auto"
      >
        {isActive ? 'Selected' : 'Select property'}
      </button>
    </article>
  );
}
