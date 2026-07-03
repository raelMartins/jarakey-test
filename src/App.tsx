import { AppProviders } from './context/AppProviders';
import { AppLayout } from './components/AppLayout';

export function App() {
  return (
    <AppProviders>
      <AppLayout />
    </AppProviders>
  );
}
