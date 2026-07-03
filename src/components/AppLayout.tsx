import { PropertyPickerView } from '../pages/PropertyPickerView';
import { ActionPageView } from '../pages/ActionPageView';
import { DevSimulatorPanel } from './DevSimulatorPanel';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              Jarakey
            </p>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              Property Context
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-xs text-slate-500 sm:block">
            Select a property to manage access and actions
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <PropertyPickerView />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6">
              <ActionPageView />
            </div>
          </div>
        </div>
      </main>

      <DevSimulatorPanel />
    </div>
  );
}
