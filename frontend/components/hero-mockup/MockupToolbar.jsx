export default function MockupToolbar() {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="text-xs text-slate-400 font-mono">devnixedu.com/dashboard</div>
      <div className="flex items-center space-x-2 text-slate-400 text-xs">
        <i className="fa-regular fa-bell" />
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
          AD
        </div>
      </div>
    </div>
  );
}