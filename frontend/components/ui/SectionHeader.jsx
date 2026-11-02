export default function SectionHeader({ badge, title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
      {badge && (
        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
    </div>
  );
}