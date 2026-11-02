export default function StatCard({ label, value, trend, trendColor }) {
  return (
    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className="text-base font-bold text-white mt-1">{value}</div>
      <div className={`text-[9px] ${trendColor} mt-1`}>{trend}</div>
    </div>
  );
}