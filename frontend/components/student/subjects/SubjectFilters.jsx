"use client";

import React from "react";
import { Search } from "lucide-react";

export default function SubjectFilters({ searchQuery, setSearchQuery, selectedSemester, setSelectedSemester }) {
  const tabs = ["All", "Current Semester", "Completed"];

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search subject, code, or instructor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-sky-500 transition"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedSemester(tab)}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition ${
              selectedSemester === tab
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}