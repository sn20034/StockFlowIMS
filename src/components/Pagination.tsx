interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, pages, total, limit, onPageChange }: PaginationProps) => {
  if (total === 0) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <p className="text-sm text-gray-500">
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary px-3 py-1.5 text-sm"
        >
          Previous
        </button>
        <span className="px-3 text-sm text-gray-600">
          Page {page} of {pages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="btn-secondary px-3 py-1.5 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};
