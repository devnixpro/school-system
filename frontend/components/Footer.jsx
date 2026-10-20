"use client";
import React from 'react';
import { Globe, Play, Apple } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#031130] text-slate-400 py-3 px-6 rounded-t-2xl flex flex-col md:flex-row items-center justify-between text-xs mt-6">
      <div className="flex items-center gap-2">
        <span className="text-white font-medium">🎓 Empowering Teahers</span>
        <span>•</span>
        <span>Building Future Futures</span>
      </div>

      <div className="flex items-center gap-4 mt-2 md:mt-0 font-medium">
        <span className="hover:text-white cursor-pointer">Web</span>
        <span className="hover:text-white cursor-pointer">Android</span>
        <span className="hover:text-white cursor-pointer">iOS</span>
        <div className="flex items-center gap-2 ml-2">
          <Globe className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Play className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Apple className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}