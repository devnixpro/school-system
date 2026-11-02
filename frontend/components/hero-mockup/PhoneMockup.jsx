export default function PhoneMockup() {
  return (
    <div className="absolute -bottom-6 -left-6 sm:-left-10 w-32 sm:w-40 bg-slate-900 rounded-3xl p-2.5 shadow-2xl border-4 border-slate-800 hidden sm:block">
      <div className="bg-slate-800 rounded-2xl p-2 text-white text-center space-y-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-xs font-bold">
          NE
        </div>
        <div className="text-[10px] font-bold">Parent App</div>
        <div className="bg-slate-700 p-1.5 rounded-lg text-[8px] text-left">
          <div className="font-semibold text-emerald-400">Attendance</div>
          <div>Ali is Present today</div>
        </div>
      </div>
    </div>
  );
}