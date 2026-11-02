import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LivePreview = ({ formData }) => {
  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              {formData.schoolName ? formData.schoolName.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Portal Preview</p>
              <h4 className="text-sm font-bold truncate max-w-[180px]">
                {formData.schoolName || 'School Name'}
              </h4>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Setup
          </span>
        </div>

        {/* Dashboard Stat Cards Mockup */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[10px] text-slate-400">Total Students</p>
            <p className="text-lg font-black text-blue-400">{formData.studentCount}</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[10px] text-slate-400">Active Modules</p>
            <p className="text-lg font-black text-emerald-400">{formData.selectedModules.length}</p>
          </div>
        </div>

        {/* Modules Pill Grid */}
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 font-medium">Configured Features</p>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-hidden">
            {formData.selectedModules.map((m) => (
              <span key={m} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700 capitalize flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-400" /> {m}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Admin: {formData.adminName || 'Not Set'}</span>
          <span className="text-slate-500">{formData.city || 'Pakistan'}</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-900 leading-snug">
          Free 14-day full access trial included. No credit card required.
        </p>
      </div>
    </div>
  );
};