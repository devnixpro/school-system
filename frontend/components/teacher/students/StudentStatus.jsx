import { Users, UserCheck, UserPlus, GraduationCap } from "lucide-react";

export default function StudentsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#11131f] p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
        <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Students</p>
          <h3 className="text-xl font-bold text-white mt-0.5">1,248</h3>
        </div>
      </div>

      <div className="bg-[#11131f] p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Active Students</p>
          <h3 className="text-xl font-bold text-white mt-0.5">1,180</h3>
        </div>
      </div>

      <div className="bg-[#11131f] p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">New Enrolled</p>
          <h3 className="text-xl font-bold text-white mt-0.5">42</h3>
        </div>
      </div>

      <div className="bg-[#11131f] p-4 rounded-2xl border border-slate-800/80 flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Avg. Attendance</p>
          <h3 className="text-xl font-bold text-white mt-0.5">92.4%</h3>
        </div>
      </div>
    </div>
  );
}