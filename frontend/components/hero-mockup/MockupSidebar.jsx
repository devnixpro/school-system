const ITEMS = [
  { icon: 'fa-chart-pie', label: 'Dashboard', active: true },
  { icon: 'fa-user-graduate', label: 'Students' },
  { icon: 'fa-chalkboard-user', label: 'Teachers' },
  { icon: 'fa-calendar-check', label: 'Attendance' },
  { icon: 'fa-receipt', label: 'Fees' },
];

export default function MockupSidebar() {
  return (
    <div className="hidden sm:block col-span-3 space-y-2 pr-2 border-r border-slate-800 text-xs">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className={`px-3 py-2 rounded-lg flex items-center space-x-2 ${
            item.active
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white cursor-pointer'
          }`}
        >
          <i className={`fa-solid ${item.icon}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}