export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="btn-secondary px-3 py-1.5 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-brand-800">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="btn-secondary px-3 py-1.5 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
