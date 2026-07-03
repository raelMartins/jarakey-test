import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, apiClient, type ApiClient } from '../api/client';
import type { Property } from '../types/property';
import type { Role } from '../types/role';
import { useToast } from './ToastContext';

interface PaginationMeta {
  page: number;
  perPage: number;
  totalCount: number;
}

interface PropertyContextValue {
  properties: Property[];
  pagination: PaginationMeta;
  activePropertyId: string | null;
  currentRole: Role | null;
  isLoadingProperties: boolean;
  isLoadingRole: boolean;
  isActionLoading: boolean;
  isDevRoleUpdating: boolean;
  propertiesError: string | null;
  roleError: string | null;
  loadProperties: (page?: number) => Promise<void>;
  setActivePropertyId: (propertyId: string) => void;
  clearActiveProperty: () => void;
  performAction: () => Promise<boolean>;
  downgradeRole: () => Promise<void>;
  upgradeRole: () => Promise<void>;
}

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  perPage: 10,
  totalCount: 0,
};

const PropertyContext = createContext<PropertyContextValue | null>(null);

export function PropertyProvider({
  children,
  client = apiClient,
}: {
  children: ReactNode;
  client?: ApiClient;
}) {
  const { showToast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [activePropertyId, setActivePropertyIdState] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDevRoleUpdating, setIsDevRoleUpdating] = useState(false);

  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  const loadProperties = useCallback(async (page = 1) => {
    setIsLoadingProperties(true);
    setPropertiesError(null);

    try {
      const result = await client.getProperties({ page });
      setProperties(result.properties);
      setPagination({
        page: result.page,
        perPage: result.perPage,
        totalCount: result.totalCount,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load properties';
      setPropertiesError(message);
      showToast(message, 'error');
    } finally {
      setIsLoadingProperties(false);
    }
  }, [client, showToast]);

  const setActivePropertyId = useCallback((propertyId: string) => {
    if (activePropertyId === propertyId) {
      return;
    }
    setCurrentRole(null);
    setRoleError(null);
    setActivePropertyIdState(propertyId);
  }, [activePropertyId]);

  const clearActiveProperty = useCallback(() => {
    setActivePropertyIdState(null);
    setCurrentRole(null);
    setRoleError(null);
  }, []);

  useEffect(() => {
    if (!activePropertyId) {
      setCurrentRole(null);
      return;
    }

    let cancelled = false;

    async function fetchRole() {
      setIsLoadingRole(true);
      setRoleError(null);

      try {
        const { role } = await client.getPropertyRole(activePropertyId!);
        if (!cancelled) {
          setCurrentRole(role);
        }
      } catch (error) {
        if (cancelled) return;

        const message = error instanceof Error ? error.message : 'Failed to load role';
        setRoleError(message);
        setCurrentRole(null);
        showToast(message, 'error');
      } finally {
        if (!cancelled) {
          setIsLoadingRole(false);
        }
      }
    }

    void fetchRole();

    return () => {
      cancelled = true;
    };
  }, [activePropertyId, client, showToast]);

  const performAction = useCallback(async (): Promise<boolean> => {
    if (!activePropertyId) {
      showToast('Select a property before performing this action.', 'error');
      return false;
    }

    setIsActionLoading(true);

    try {
      const result = await client.performAction(activePropertyId);
      showToast(result.message, 'success');
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setCurrentRole('Tenant');
        showToast(
          'Your permissions have changed. Manager access is no longer available.',
          'error',
        );
        return false;
      }

      const message = error instanceof Error ? error.message : 'Action failed';
      showToast(message, 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  }, [activePropertyId, client, showToast]);

  const downgradeRole = useCallback(async (): Promise<void> => {
    if (!activePropertyId) {
      showToast('Select a property before simulating role drift.', 'error');
      return;
    }

    setIsDevRoleUpdating(true);

    try {
      const { role } = await client.downgradeRole(activePropertyId);
      setCurrentRole(role);
      showToast('Dev: role downgraded to Tenant for the active property.', 'error');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Downgrade failed';
      showToast(message, 'error');
    } finally {
      setIsDevRoleUpdating(false);
    }
  }, [activePropertyId, client, showToast]);

  const upgradeRole = useCallback(async (): Promise<void> => {
    if (!activePropertyId) {
      showToast('Select a property before simulating role change.', 'error');
      return;
    }

    setIsDevRoleUpdating(true);

    try {
      const { role } = await client.upgradeRole(activePropertyId);
      setCurrentRole(role);
      showToast('Dev: role upgraded to Manager for the active property.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upgrade failed';
      showToast(message, 'error');
    } finally {
      setIsDevRoleUpdating(false);
    }
  }, [activePropertyId, client, showToast]);

  const value = useMemo<PropertyContextValue>(
    () => ({
      properties,
      pagination,
      activePropertyId,
      currentRole,
      isLoadingProperties,
      isLoadingRole,
      isActionLoading,
      isDevRoleUpdating,
      propertiesError,
      roleError,
      loadProperties,
      setActivePropertyId,
      clearActiveProperty,
      performAction,
      downgradeRole,
      upgradeRole,
    }),
    [
      properties,
      pagination,
      activePropertyId,
      currentRole,
      isLoadingProperties,
      isLoadingRole,
      isActionLoading,
      isDevRoleUpdating,
      propertiesError,
      roleError,
      loadProperties,
      setActivePropertyId,
      clearActiveProperty,
      performAction,
      downgradeRole,
      upgradeRole,
    ],
  );

  return (
    <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>
  );
}

export function usePropertyContext(): PropertyContextValue {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
}
