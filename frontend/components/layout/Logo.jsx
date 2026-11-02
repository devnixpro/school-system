'use client';

import { useScrollTo } from '@/hooks/useScrollTo';

export default function Logo({ variant = 'dark' }) {
  const { scrollToTop } = useScrollTo();
  const textColor = variant === 'dark' ? 'text-gray-900' : 'text-white';

  return (
    <div
      onClick={scrollToTop}
      className="flex items-center space-x-3 cursor-pointer group"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
        <i className="fa-solid fa-graduation-cap text-lg" />
      </div>
      <div>
        <span className={`text-xl font-extrabold ${textColor} tracking-tight`}>
          DevNixEdu
        </span>
        <span className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
          Smart School Management
        </span>
      </div>
    </div>
  );
}