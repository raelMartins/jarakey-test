interface PaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      {direction === 'left' ? (
        <path
          fillRule="evenodd"
          d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

export function Pagination({
  page,
  perPage,
  totalCount,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const start = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);

  const buttonBase =
    'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2';

  const enabledStyles =
    'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-md';

  const disabledStyles =
    'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 shadow-none';

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{start}</span>
        {' – '}
        <span className="font-medium text-slate-700">{end}</span> of{' '}
        <span className="font-medium text-slate-700">{totalCount}</span>
      </p>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> of{' '}
          <span className="font-medium text-slate-700">{totalPages}</span>
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={isFirstPage || isLoading}
            onClick={() => onPageChange(page - 1)}
            className={`${buttonBase} ${isFirstPage || isLoading ? disabledStyles : enabledStyles}`}
            aria-label="Previous page"
          >
            <ChevronIcon direction="left" />
            Previous
          </button>

          <button
            type="button"
            disabled={isLastPage || isLoading}
            onClick={() => onPageChange(page + 1)}
            className={`${buttonBase} ${isLastPage || isLoading ? disabledStyles : enabledStyles}`}
            aria-label="Next page"
          >
            Next
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </nav>
  );
}
