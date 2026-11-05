import { TESTIMONIALS } from '@/data/testimonials';
import SectionHeader from '@/components/ui/SectionHeader';
import StarRating from '@/components/ui/StarRating';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="What School Leaders Say"
          subtitle="Trusted by hundreds of schools across Pakistan for reliable daily operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.initials} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ initials, name, role, quote }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <StarRating />
        <p className="text-gray-700 text-sm italic leading-relaxed">"{quote}"</p>
      </div>
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          {initials}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}