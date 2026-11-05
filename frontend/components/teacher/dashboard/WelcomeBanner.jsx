"use client";
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#031435] text-white shadow-xl min-h-[160px] flex items-center p-6 md:p-8">
      <div 
        className="absolute inset-0 bg-cover bg-right md:bg-center z-0"
        style={{ backgroundImage: "url('/welcom banner.jpg')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#031435] via-[#031435]/90 to-transparent z-10 w-full md:w-[75%]" />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between w-full gap-6">

        <div className="space-y-1.5">
          <p className="text-sm md:text-base font-medium text-slate-200">
            Welcome Back,
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2 text-white">
            Zoya Ali <span className="inline-block text-2xl md:text-3xl">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-normal pt-0.5">
            Here's what's happening in your classes today.
          </p>

          {/* Date & Time Bar */}
          <div className="flex items-center gap-3 pt-3 text-xs md:text-sm text-slate-200 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white opacity-90" />
              <span>Tuesday, 17 June 2025</span>
            </div>
            
            <span className="text-slate-400 font-light">|</span>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white opacity-90" />
              <span>10:24 AM</span>
            </div>
          </div>
        </div>

        {/* Right Side: School Logo & Tagline */}
        <div className="flex items-center gap-3 self-end md:self-center bg-black/10 p-2 px-3 rounded-xl  md:border-none">
          {/* Logo Crest Icon */}
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M12 3v18" />
            </svg>
          </div>

          {/* School Name & Tagline */}
          <div className="text-left">
            <h2 className="font-bold text-base md:text-lg tracking-wide leading-tight text-white">
              Beaconhouse School
            </h2>
            <p className="text-white md:text-xs text-slate-300 tracking-wider font-light mt-0.5">
              Herre &nbsp;|&nbsp; Grow &nbsp;|&nbsp; Succeed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}