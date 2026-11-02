const STYLES = {
  upcoming: { wrap: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500", label: "Upcoming" },
  ongoing: { wrap: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500", label: "Ongoing" },
  "result-declared": { wrap: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500", label: "Result Declared" },
  cancelled: { wrap: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500", label: "Cancelled" },
};

export default function ExamStatusBadge({ status, size = "md" }) {
  const s = STYLES[status] || { wrap: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-400", label: status || "Unknown" };
  const sizing = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizing} ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
