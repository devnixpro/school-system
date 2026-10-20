"use client";
import React from 'react';
import { Users } from 'lucide-react';

const SCHEDULE = [
  { id: 1, class: 'Class 6-A', time: '10:00 AM', subject: 'Subject', status: 'Pundiing', color: 'bg-amber-100 text-amber-700' },
  { id: 2, class: 'Class 6-A', time: '12:00 PM', subject: 'Subject', status: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  { id: 3, class: 'Class 6-A', time: '12:00 PM', subject: 'Subject', status: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  { id: 4, class: 'Class 6-A', time: '12:30 PM', subject: 'Subject', status: 'Pundiing', color: 'bg-amber-100 text-amber-700' },
  { id: 5, class: 'Class 6-A', time: '10:00 AM', subject: 'Total', status: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
];

export default function ClassScheduleTable() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Today's Class Schedule</h3>
        </div>
        <button className="text-[11px] text-sky-600 font-semibold hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 border-b border-slate-100">
              <th className="pb-2 font-bold">#</th>
              <th className="pb-2 font-bold">Class</th>
              <th className="pb-2 font-bold">Time</th>
              <th className="pb-2 font-bold">Subject</th>
              <th className="pb-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
            {SCHEDULE.map((row) => (
              <tr key={row.id}>
                <td className="py-2 text-slate-400">{row.id}</td>
                <td className="py-2">{row.class}</td>
                <td className="py-2 text-slate-500">{row.time}</td>
                <td className="py-2">{row.subject}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${row.color}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}