import { usePropertyContext } from '../context/PropertyContext';
import { RoleBadge } from '../components/ui/PropertyMedia';
import { EmptyState } from '../components/ui';

export function ActionPageView() {
  const {
    activeProperty,
    currentRole,
    isLoadingRole,
    isActionLoading,
    performAction,
  } = usePropertyContext();

  if (!activeProperty) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6">
        <EmptyState
          title="No property selected"
          message="Choose a property from the list to view details and available actions."
        />
      </div>
    );
  }

  const showManagerAction = !isLoadingRole && currentRole === 'Manager';

  return (
    <section
      aria-labelledby="property-detail-heading"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50"
    >
      <div className="relative aspect-[16/10] bg-slate-100">
        <img
          src={activeProperty.imageUrl}
          alt={activeProperty.propertyName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-300">
            Active property
          </p>
          <h2
            id="property-detail-heading"
            className="mt-1 text-xl font-bold text-white sm:text-2xl"
          >
            {activeProperty.propertyName}
          </h2>
          <p className="mt-1 text-sm text-slate-200">
            {activeProperty.addressLine1}, {activeProperty.city}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Your access
          </p>
          {isLoadingRole ? (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              Verifying role…
            </div>
          ) : currentRole ? (
            <div className="mt-2">
              <RoleBadge role={currentRole} className="!bg-emerald-100 !text-emerald-800" />
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Role unavailable</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Actions
          </p>

          {showManagerAction && (
            <div className="manager-action-enter mt-3">
              <button
                type="button"
                disabled={isActionLoading}
                onClick={() => void performAction()}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isActionLoading ? 'Performing action…' : 'Perform Manager Action'}
              </button>
            </div>
          )}

          {!isLoadingRole && currentRole === 'Tenant' && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Tenant access only. Manager actions are not available for this property.
            </p>
          )}

          {isLoadingRole && (
            <p className="mt-3 text-sm text-slate-500">Loading available actions…</p>
          )}
        </div>
      </div>
    </section>
  );
}
