"use client";

import React from "react";
import { Clock, MapPin, User, Coffee } from "lucide-react";

export default function PeriodCard({ period }) {
  if (period.isBreak) {
    return (
      <div className="flex items-center justify-between p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-amber-900">{period.subject}</h4>
            <p className="text-xs text-amber-700">{period.time}</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
          {period.duration}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-2xl border transition ${
        period.isCurrent
          ? "bg-blue-50/40 border-[#1B63E0] ring-2 ring-[#1B63E0]/20 shadow-sm"
          : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-10 rounded-full"
            style={{ backgroundColor: period.badgeColor || "#1B63E0" }}
          ></div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#0B1E36]">{period.subject}</h3>
              {period.isCurrent && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-700 rounded-full animate-pulse">
                  Ongoing
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{period.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
          <Clock className="w-3.5 h-3.5 text-[#1B63E0]" />
          <span>{period.time}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <User className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-800">{period.teacher}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{period.room}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 text-slate-500 text-right sm:text-right font-medium">
          {period.duration}
        </div>
      </div>
    </div>
  );
}