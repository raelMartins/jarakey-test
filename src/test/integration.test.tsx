import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleMockFetch } from '../api/mockFetch';
import { resetMockDb } from '../api/mockDb';
import {
  cleanup,
  getPropertyPickerRegion,
  readPropertyIdHeader,
  renderApp,
  resolveFetchUrl,
  waitForPropertiesToLoad,
} from './testUtils';

describe('integration', () => {
  beforeEach(() => {
    cleanup();
    resetMockDb();
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn(handleMockFetch));
  });

  it('sends X-Property-ID when a property is selected', async () => {
    const fetchMock = vi.mocked(fetch);
    const user = userEvent.setup();

    renderApp();
    await waitForPropertiesToLoad();

    fetchMock.mockClear();

    const selectButtons = screen.getAllByRole('button', { name: /^select /i });
    await user.click(selectButtons[0]!);

    await waitFor(() => {
      const roleRequest = fetchMock.mock.calls.find(([input]) => {
        return resolveFetchUrl(input).pathname.endsWith('/role');
      });

      expect(roleRequest).toBeDefined();
      expect(readPropertyIdHeader(roleRequest?.[1])).toBe('prop-001');
    });
  });

  it('hides the manager action after a 403 without crashing', async () => {
    const fetchMock = vi.mocked(fetch);
    const user = userEvent.setup();

    fetchMock.mockImplementation(async (input, init) => {
      const url = resolveFetchUrl(input);
      const method = (init?.method ?? 'GET').toUpperCase();

      if (method === 'POST' && url.pathname === '/action') {
        return new Response(JSON.stringify({ error: 'Forbidden: Manager role required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return handleMockFetch(input, init);
    });

    renderApp();
    await waitForPropertiesToLoad();

    await user.click(screen.getAllByRole('button', { name: /^select /i })[0]!);

    const managerAction = await screen.findByRole('button', {
      name: /perform manager action/i,
    });
    await user.click(managerAction);

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /perform manager action/i }),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText(/tenant access only/i)).toBeInTheDocument();
  });

  it('renders exactly 10 property items on the first page', async () => {
    renderApp();

    const picker = getPropertyPickerRegion();

    await waitFor(() => {
      expect(within(picker).getAllByRole('button', { name: /^select /i })).toHaveLength(10);
    });
  });
});
