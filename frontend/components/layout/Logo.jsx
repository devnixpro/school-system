'use client';

import { useScrollTo } from '@/hooks/useScrollTo';
import Image from 'next/image';
import LogoImg from '@/public/mainlogo.png'; // Variable ka naam change kar diya

export default function Logo({ variant = 'dark' }) {
  const { scrollToTop } = useScrollTo();
  const textColor = variant === 'dark' ? 'text-gray-900' : 'text-white';

  return (
    <div
      onClick={scrollToTop}
      className="flex items-center space-x-3 cursor-pointer group"
    >
      <div className="w-14 h-14 ">
        <Image
          src={LogoImg}
          alt="DevNixEdu Logo"
          width={32}
          height={32}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <span className={`text-xl font-extrabold ${textColor} tracking-tight`}>
          Dev
          <span className="text-blue-600">Nix</span>
          Edu
        </span>
        <span className="block text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
          Smart School Management
        </span>
      </div>
    </div>
  );
}