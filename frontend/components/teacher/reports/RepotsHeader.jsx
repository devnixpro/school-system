import { Plus, Download } from "lucide-react";

export default function ReportsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate, view, and export student performance and class activity reports.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-colors">
          <Download className="w-4 h-4 text-slate-600" />
          Export All
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" />
          Generate New Report
        </button>
      </div>
    </div>
  );
}