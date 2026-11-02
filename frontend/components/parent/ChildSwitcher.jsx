'use client';

// Uses the platform's Tailwind colors (tailwind.config.js, doc Section 6.2):
// "brand" = #0077F5, "navy" = #12151C.
export default function ChildSwitcher({ childList, selectedId, onChange }) {
  if (childList.length <= 1) return null; // nothing to switch

  return (
    <div role="tablist" aria-label="Select child" className="flex flex-wrap gap-2">
      {childList.map((child) => {
        const active = child._id === selectedId;
        return (
          <button
            key={child._id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(child._id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active
                ? 'border-brand bg-brand text-white'
                : 'border-slate-300 bg-white text-navy hover:border-brand'
            }`}
          >
            {child.name}
          </button>
        );
      })}
    </div>
  );
}
