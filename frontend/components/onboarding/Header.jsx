'use client';

import React from 'react';
import { GraduationCap, Phone, ArrowLeft, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 h-16 flex items-center justify-between">
        
        {/* Left Section: Back Button + Clean Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all border border-slate-200/60 active:scale-95 flex items-center gap-1.5 text-xs font-medium"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                DevNix<span className="text-blue-600">Edu</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100/80 uppercase tracking-wider">
                Setup
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Support & Help Link */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <a
            href="tel:+923001234567"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all text-slate-700"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Need Help? <strong className="text-slate-900 font-semibold">+92 300 1234567</strong></span>
          </a>

          <a
            href="mailto:support@devnixedu.com"
            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors py-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
            <span className="hidden sm:inline">Support</span>
          </a>
        </div>

      </div>
    </header>
  );
};