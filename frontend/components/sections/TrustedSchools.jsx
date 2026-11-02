import { SCHOOLS } from '@/data/schools';
import StarRating from '@/components/ui/StarRating';

export default function TrustedSchools() {
  return (
    <section id="schools" className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
          Trusted by leading schools across Pakistan
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-center">
          {SCHOOLS.map((school, i) => (
            <div
              key={school.name}
              className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center space-x-2 font-bold text-gray-700 ${
                i === SCHOOLS.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <i className={`${school.icon} text-blue-600`} />
              <span>{school.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-1 text-amber-500 text-sm">
          <StarRating />
          <span className="text-gray-600 font-semibold ml-2">
            Rated 4.9/5 by school admins
          </span>
        </div>
      </div>
    </section>
  );
}