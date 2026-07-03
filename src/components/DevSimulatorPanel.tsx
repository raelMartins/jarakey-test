import { usePropertyContext } from '../context/PropertyContext';

export function DevSimulatorPanel() {
  const { activePropertyId, currentRole, isDowngrading, downgradeRole } =
    usePropertyContext();

  return (
    <aside
      aria-label="Dev Simulator"
      className="fixed bottom-4 left-4 z-40 w-[min(100%,20rem)] rounded-xl border-2 border-amber-400 bg-amber-50 p-4 shadow-lg transition-shadow duration-200 hover:shadow-xl"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-950">
          Dev
        </span>
        <h2 className="text-sm font-bold text-amber-950">Dev Simulator</h2>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-amber-900/80">
        Simulate mid-session role drift by downgrading the active property to Tenant.
      </p>

      <dl className="mt-3 space-y-1 text-xs text-amber-950">
        <div className="flex justify-between gap-2">
          <dt className="font-medium">Active property</dt>
          <dd className="truncate font-mono">{activePropertyId ?? 'None'}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="font-medium">Current role</dt>
          <dd>{currentRole ?? '—'}</dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={!activePropertyId || isDowngrading}
        onClick={() => void downgradeRole()}
        className="mt-4 w-full rounded-lg border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-sm transition-all duration-200 hover:bg-amber-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDowngrading ? 'Downgrading…' : 'POST /dev/downgrade'}
      </button>
    </aside>
  );
}
