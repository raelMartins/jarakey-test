import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, apiClient } from '../api/client';
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
  isDowngrading: boolean;
  propertiesError: string | null;
  roleError: string | null;
  loadProperties: (page?: number) => Promise<void>;
  setActivePropertyId: (propertyId: string) => void;
  clearActiveProperty: () => void;
  performAction: () => Promise<boolean>;
  downgradeRole: () => Promise<void>;
}

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  perPage: 10,
  totalCount: 0,
};

const PropertyContext = createContext<PropertyContextValue | null>(null);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [activePropertyId, setActivePropertyIdState] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);

  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  const loadProperties = useCallback(async (page = 1) => {
    setIsLoadingProperties(true);
    setPropertiesError(null);

    try {
      const result = await apiClient.getProperties({ page });
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
  }, [showToast]);

  const setActivePropertyId = useCallback((propertyId: string) => {
    setActivePropertyIdState(propertyId);
    setCurrentRole(null);
    setRoleError(null);
  }, []);

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
        const { role } = await apiClient.getPropertyRole(activePropertyId!);
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
  }, [activePropertyId, showToast]);

  const performAction = useCallback(async (): Promise<boolean> => {
    if (!activePropertyId) {
      showToast('Select a property before performing this action.', 'error');
      return false;
    }

    setIsActionLoading(true);

    try {
      const result = await apiClient.performAction(activePropertyId);
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
  }, [activePropertyId, showToast]);

  const downgradeRole = useCallback(async (): Promise<void> => {
    if (!activePropertyId) {
      showToast('Select a property before simulating role drift.', 'error');
      return;
    }

    setIsDowngrading(true);

    try {
      const { role } = await apiClient.downgradeRole(activePropertyId);
      setCurrentRole(role);
      showToast('Dev: role downgraded to Tenant for the active property.', 'error');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Downgrade failed';
      showToast(message, 'error');
    } finally {
      setIsDowngrading(false);
    }
  }, [activePropertyId, showToast]);

  const value = useMemo<PropertyContextValue>(
    () => ({
      properties,
      pagination,
      activePropertyId,
      currentRole,
      isLoadingProperties,
      isLoadingRole,
      isActionLoading,
      isDowngrading,
      propertiesError,
      roleError,
      loadProperties,
      setActivePropertyId,
      clearActiveProperty,
      performAction,
      downgradeRole,
    }),
    [
      properties,
      pagination,
      activePropertyId,
      currentRole,
      isLoadingProperties,
      isLoadingRole,
      isActionLoading,
      isDowngrading,
      propertiesError,
      roleError,
      loadProperties,
      setActivePropertyId,
      clearActiveProperty,
      performAction,
      downgradeRole,
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
