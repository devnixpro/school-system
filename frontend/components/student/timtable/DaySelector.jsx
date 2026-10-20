"use client";

import React from "react";

export default function DaySelector({ selectedDay, setSelectedDay, days }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
      {days.map((day) => {
        const isSelected = selectedDay === day.id;
        return (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              isSelected
                ? "bg-[#0B1E36] text-white shadow-md shadow-slate-900/10"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{day.label}</span>
            {day.isToday && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-[#1B63E0]"
              }`}>
                Today
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}