"use client";

export default function ChildFeesError({ error, reset }) {
  return (
    <main className="p-8 max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Couldn&apos;t load child fees</h2>
      <p className="text-sm text-gray-500 mb-6">
        {error?.message || "Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
      >
        Retry
      </button>
    </main>
  );
}