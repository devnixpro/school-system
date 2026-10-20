"use client";

import React from "react";

export default function WeekGrid({ weeklySchedule, days }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-[#0B1E36] text-white text-xs uppercase tracking-wider">
            <th className="py-3.5 px-4 font-semibold rounded-tl-2xl w-28">Time</th>
            {days.map((day, idx) => (
              <th 
                key={day.id} 
                className={`py-3.5 px-4 font-semibold text-center ${
                  idx === days.length - 1 ? "rounded-tr-2xl" : ""
                }`}
              >
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
          {weeklySchedule.map((row, index) => (
            <tr key={index} className={row.isBreak ? "bg-amber-50/40" : "hover:bg-slate-50/60"}>
              <td className="py-3.5 px-4 font-semibold text-slate-500 whitespace-nowrap bg-slate-50/50">
                {row.time}
              </td>
              {row.slots.map((slot, sIdx) => (
                <td key={sIdx} className="py-3.5 px-3 text-center border-l border-slate-100">
                  {slot ? (
                    slot.isBreak ? (
                      <span className="text-amber-800 font-bold bg-amber-100/80 px-2.5 py-1 rounded-lg inline-block">
                        {slot.subject}
                      </span>
                    ) : (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-left">
                        <p className="font-bold text-[#0B1E36]">{slot.subject}</p>
                        <p className="text-[11px] text-slate-500">{slot.room}</p>
                      </div>
                    )
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}