export default function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-4 py-2">Page {page}</span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={!hasNext}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
