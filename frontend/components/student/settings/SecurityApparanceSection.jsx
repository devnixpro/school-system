"use client";

import React from "react";
import { Check } from "lucide-react";

export function SecuritySection() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-[#0B1E36]">Security Settings</h2>
        <p className="text-xs text-slate-500">Manage password and account protection.</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Confirm New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition"
          />
        </div>
      </div>
    </div>
  );
}

export function AppearanceSection() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-[#0B1E36]">Appearance & Theme</h2>
        <p className="text-xs text-slate-500">Customize how DevNixEdu looks for you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border-2 border-[#1B63E0] bg-blue-50/30 rounded-2xl cursor-pointer">
          <div className="h-20 bg-[#F4F7FE] border border-slate-200 rounded-xl mb-3 p-2 flex gap-2">
            <div className="w-1/4 bg-[#0B1E36] rounded-md"></div>
            <div className="w-3/4 bg-white rounded-md shadow-sm"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0B1E36]">Light Mode (Default)</span>
            <Check className="w-5 h-5 text-[#1B63E0]" />
          </div>
        </div>

        <div className="p-4 border border-slate-200 rounded-2xl opacity-60 cursor-pointer hover:border-slate-300">
          <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl mb-3 p-2 flex gap-2">
            <div className="w-1/4 bg-slate-950 rounded-md"></div>
            <div className="w-3/4 bg-slate-800 rounded-md"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Dark Mode</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}