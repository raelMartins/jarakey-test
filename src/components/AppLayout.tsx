import { PropertyPickerView } from "../pages/PropertyPickerView";
import { ActionPageView } from "../pages/ActionPageView";
import { DevSimulatorPanel } from "./DevSimulatorPanel";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Jarakey
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">
            Property Context Demo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Unified access management | active property context with role drift
            handling
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <PropertyPickerView />
          </div>
          <div className="lg:col-span-2">
            <ActionPageView />
          </div>
        </div>
      </main>

      <DevSimulatorPanel />
    </div>
  );
}
