import { FEATURES } from '@/data/features';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Core Features"
          title="Everything Your School Needs in One Place"
          subtitle="Designed specifically for Pakistani educational institutions to streamline daily administrative workload."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg mb-6 group-hover:scale-110 transition-transform shadow-md shadow-blue-500/20">
        <i className={icon} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}