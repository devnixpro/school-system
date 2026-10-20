const STYLES = {
  paid:    { wrap: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  pending: { wrap: "bg-amber-50 text-amber-700 ring-amber-600/20",       dot: "bg-amber-500" },
  overdue: { wrap: "bg-red-50 text-red-700 ring-red-600/20",             dot: "bg-red-500" },
};

const LABELS = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export default function PaymentStatusBadge({ status, size = "md" }) {
  const s = STYLES[status] || {
    wrap: "bg-gray-100 text-gray-700 ring-gray-500/20",
    dot: "bg-gray-400",
  };
  const sizing = size === "sm"
    ? "px-2 py-0.5 text-[10px]"
    : "px-2.5 py-1 text-xs";

  return (
    <span
      role="status"
      aria-label={`Payment status: ${LABELS[status] || status}`}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ring-1 ring-inset ${sizing} ${s.wrap}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {LABELS[status] || status}
    </span>
  );
}