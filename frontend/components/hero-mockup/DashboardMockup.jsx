import MockupToolbar from './MockupToolbar';
import MockupSidebar from './MockupSidebar';
import StatCard from './StatCard';
import PhoneMockup from './PhoneMockup';

const CHART_BARS = [40, 60, 50, 80, 95];
const BAR_OPACITY = ['bg-blue-600/30', 'bg-blue-600/50', 'bg-blue-600/70', 'bg-blue-600/80', 'bg-blue-600'];

export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="bg-slate-900 rounded-2xl p-4 dashboard-shadow border border-slate-800 text-white relative">
        <MockupToolbar />
        <div className="grid grid-cols-12 gap-4">
          <MockupSidebar />
          <div className="col-span-12 sm:col-span-9 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Dashboard Overview</h3>
                <p className="text-[10px] text-slate-400">Welcome back, Principal Admin</p>
              </div>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2.5 py-1 rounded-md font-semibold">
                Live System
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatCard label="Total Students" value="2,456" trend="+12% this month" trendColor="text-emerald-400" />
              <StatCard label="Active Teachers" value="156" trend="+4 new" trendColor="text-emerald-400" />
              <StatCard label="Fee Collection" value="Rs. 12.5M" trend="94% Paid" trendColor="text-blue-400" />
            </div>

            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Student Growth & Attendance
                </span>
                <span className="text-[10px] text-slate-400">2026 Academic Year</span>
              </div>
              <div className="h-20 flex items-end justify-between space-x-2 pt-2">
                {CHART_BARS.map((h, i) => (
                  <div
                    key={i}
                    className={`w-full ${BAR_OPACITY[i]} rounded-t`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PhoneMockup />
    </div>
  );
}