import { usePropertyContext } from '../context/PropertyContext';
import { EmptyState } from '../components/ui';

export function ActionPageView() {
  const {
    activePropertyId,
    currentRole,
    properties,
    isLoadingRole,
    isActionLoading,
    performAction,
  } = usePropertyContext();

  const activeProperty = properties.find((p) => p.propertyId === activePropertyId);

  if (!activePropertyId) {
    return (
      <section aria-labelledby="action-panel-heading">
        <EmptyState
          title="No property selected"
          message="Choose a property from the list to view available actions."
        />
      </section>
    );
  }

  const showManagerAction = !isLoadingRole && currentRole === 'Manager';

  return (
    <section
      aria-labelledby="action-panel-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <header className="border-b border-slate-100 pb-4">
        <h2 id="action-panel-heading" className="text-lg font-semibold text-slate-900">
          Action panel
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Active:{' '}
          <span className="font-medium text-slate-700">
            {activeProperty?.propertyName ?? activePropertyId}
          </span>
        </p>
      </header>

      <div className="mt-6 space-y-4">
        {isLoadingRole && (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
            Loading role from server…
          </div>
        )}

        {!isLoadingRole && currentRole && (
          <p className="text-sm text-slate-600">
            Your role:{' '}
            <span className="font-medium text-slate-800">{currentRole}</span>
          </p>
        )}

        {showManagerAction && (
          <div className="manager-action-enter">
            <button
              type="button"
              disabled={isActionLoading}
              onClick={() => void performAction()}
              className="w-full rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isActionLoading ? 'Performing action…' : 'Perform Manager Action'}
            </button>
          </div>
        )}

        {!isLoadingRole && currentRole === 'Tenant' && (
          <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Tenant access only. Manager actions are not available for this property.
          </p>
        )}
      </div>
    </section>
  );
}
