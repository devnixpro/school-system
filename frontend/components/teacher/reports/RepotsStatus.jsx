import { FileText, CheckCircle2, Clock, BarChart3 } from "lucide-react";

export default function ReportsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Reports */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Total Reports</p>
          <h3 className="text-xl font-bold text-slate-800 mt-0.5">24</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">↑ 8% vs last month</span>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Completed</p>
          <h3 className="text-xl font-bold text-slate-800 mt-0.5">18</h3>
          <span className="text-[10px] text-slate-400 font-medium">75% of total</span>
        </div>
      </div>

      {/* Pending Review */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Pending Review</p>
          <h3 className="text-xl font-bold text-slate-800 mt-0.5">4</h3>
          <span className="text-[10px] text-amber-600 font-semibold">Requires Action</span>
        </div>
      </div>

      {/* Drafts */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Drafts</p>
          <h3 className="text-xl font-bold text-slate-800 mt-0.5">2</h3>
          <span className="text-[10px] text-slate-400 font-medium">In Progress</span>
        </div>
      </div>
    </div>
  );
}