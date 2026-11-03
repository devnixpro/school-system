import { Download } from "lucide-react";

export default function StudentsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Students Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          View student records, track attendance, and monitor performance.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-sky-600/20">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>
    </div>
  );
}