import { Download } from "lucide-react";

export default function StudentsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Students Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          View student records, track attendance, and monitor performance.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>
    </div>
  );
}