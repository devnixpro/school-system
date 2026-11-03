"use client";

import React from "react";
import { Search } from "lucide-react";

export default function ClassFilters({ searchQuery, setSearchQuery, selectedClass, setSelectedClass }) {
  const tabs = ["All", "Grade 10", "Grade 9", "Grade 11"];

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search classes or sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-sky-500 transition"
        />
      </div>

      {/* Quick Class Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedClass(tab)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedClass === tab
                ? "bg-sky-600 text-white shadow"
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