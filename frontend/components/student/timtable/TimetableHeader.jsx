"use client";

import React from "react";
import { Download, Calendar, Filter } from "lucide-react";

export default function TimetableHeader({ 
  selectedDay, 
  setSelectedDay, 
  viewMode, 
  setViewMode, 
  days 
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1E36]">Class Timetable</h1>
        <p className="text-sm text-slate-500">
          View your daily class schedules, classroom numbers, and teacher details.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle Day / Week View */}
        <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm">
          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === "day"
                ? "bg-[#1B63E0] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === "week"
                ? "bg-[#1B63E0] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Full Week View
          </button>
        </div>

        {/* Download Schedule Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B63E0] hover:bg-[#1552BD] rounded-xl shadow-md shadow-blue-500/20 transition">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>
    </div>
  );
}