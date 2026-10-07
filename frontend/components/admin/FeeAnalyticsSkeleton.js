/**
 * Loading skeleton for the fee analytics dashboard.
 * Pure CSS — no dependencies.
 */
export default function FeeAnalyticsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading analytics">
      {/* 3 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 h-28 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>

      {/* 2 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-72" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-72" />
      </div>
    </div>
  );
}