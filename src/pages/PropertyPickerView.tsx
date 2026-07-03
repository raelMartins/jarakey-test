import { useEffect } from 'react';
import { usePropertyContext } from '../context/PropertyContext';
import {
  EmptyState,
  Pagination,
  PropertyCard,
  PropertyCardSkeletonList,
} from '../components/ui';

export function PropertyPickerView() {
  const {
    properties,
    pagination,
    activePropertyId,
    currentRole,
    isLoadingProperties,
    propertiesError,
    loadProperties,
    setActivePropertyId,
  } = usePropertyContext();

  useEffect(() => {
    void loadProperties(1);
  }, [loadProperties]);

  function handlePageChange(page: number) {
    void loadProperties(page);
  }

  function handleRetry() {
    void loadProperties(pagination.page);
  }

  return (
    <section aria-labelledby="property-picker-heading" className="space-y-6">
      <header>
        <h2 id="property-picker-heading" className="text-lg font-semibold text-slate-900">
          Your properties
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select a property to set your active context.
        </p>
      </header>

      {isLoadingProperties && <PropertyCardSkeletonList count={pagination.perPage} />}

      {!isLoadingProperties && propertiesError && (
        <EmptyState
          title="Could not load properties"
          message={propertiesError}
          action={
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-800 hover:shadow-md"
            >
              Try again
            </button>
          }
        />
      )}

      {!isLoadingProperties && !propertiesError && properties.length === 0 && (
        <EmptyState
          title="No properties found"
          message="There are no properties assigned to your account."
        />
      )}

      {!isLoadingProperties && !propertiesError && properties.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard
                key={property.propertyId}
                property={property}
                isActive={property.propertyId === activePropertyId}
                role={
                  property.propertyId === activePropertyId ? currentRole : undefined
                }
                onSelect={setActivePropertyId}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            perPage={pagination.perPage}
            totalCount={pagination.totalCount}
            isLoading={isLoadingProperties}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
