"use client";
import React from 'react';
import { Users, FileCheck, BarChart3, ChevronDown, User2, Users2, PieChart } from 'lucide-react';

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Class Ranking Progress */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800">Student Growth</h3>
          </div>
          <button className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600 flex items-center gap-1 font-semibold">
            Today <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Dummy SVG Line Chart */}
        <div className="mt-4 relative">
          <div className="absolute right-6 top-1 bg-sky-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
            1.245
          </div>
          <svg className="w-full h-32 overflow-visible" viewBox="0 0 300 100">
            <path d="M 0 80 Q 50 60 100 40 T 200 60 T 300 20" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <path d="M 0 70 Q 50 30 100 50 T 200 80 T 300 50" fill="none" stroke="#10b981" strokeWidth="2" />
            <path d="M 0 90 Q 50 80 100 70 T 200 70 T 300 70" fill="none" stroke="#f59e0b" strokeWidth="2" />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>
      </div>

      {/* 2. Assignment Completion Status */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Homework Submission Status</h3>
        </div>

        <div className="flex items-center justify-around mt-3">
          {/* Donut Chart */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4.5" />
              <path strokeDasharray="10, 100" strokeDashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="4.5" />
              <path strokeDasharray="5, 100" strokeDashoffset="-90" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4.5" />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">45</span>
          </div>

          {/* Legends */}
          <div className="space-y-1.5 text-[11px] font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Done On Time</span> <span className="font-bold text-slate-900 ml-auto">45</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Done Late</span> <span className="font-bold text-slate-900 ml-auto">5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Not Done</span> <span className="font-bold text-slate-900 ml-auto">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Subject Performance Trend */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Class Grading</h3>
        </div>

        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
          {/* Main Content Area: Chart + Legend */}
          <div className="flex items-center justify-between gap-4 mt-2">

            {/* Chart Container */}
            <div className="relative flex-1 h-36 border-b border-l border-slate-200 pl-2 pb-1">

              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1 pl-2">
                {[50, 40, 30, 20, 10, 0].map((val, idx) => (
                  <div key={idx} className="w-full border-b border-slate-100 flex items-center">
                    <span className="text-[9px] text-slate-400 absolute -left-5 -translate-y-1/2">{val}</span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="relative h-full flex items-end justify-around px-2 z-10">
                {[
                  { label: 'Jan', bars: ['h-20 bg-blue-600', 'h-8 bg-amber-500'] },
                  { label: 'May', bars: ['h-28 bg-blue-600', 'h-16 bg-amber-500'] },
                  { label: 'Jun', bars: ['h-32 bg-emerald-500', 'h-36 bg-amber-500'] }
                ].map((subj, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1">
                      <div className={`w-3 rounded-t-sm ${subj.bars[0]}`} />
                      <div className={`w-3 rounded-t-sm ${subj.bars[1]}`} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium -bottom-4 absolute">{subj.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Legend */}
            <div className="flex flex-col gap-2.5 pl-2 border-l border-slate-100 min-w-[110px]">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Present</span>
                </div>
                <span className="font-bold text-slate-800">1,102</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Absent</span>
                </div>
                <span className="font-bold text-slate-800">126</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Late</span>
                </div>
                <span className="font-bold text-slate-800">26</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}