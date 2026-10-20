"use client";
import React from 'react';
import { FileText, ChevronDown } from 'lucide-react';

const SUBMISSIONS = [
  { name: 'Ayaan Khan', title: 'Assignment Title 1', class: 'Class 6', status: 'Submitted', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Fatima Noor', title: 'Assignment Title 2', class: 'Class 6', status: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { name: 'Fatima Noor', title: 'Assignment Title 2', class: 'Class 6', status: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { name: 'Muhammad Ali', title: 'Assignment Title 3', class: 'Class 5', status: 'Graded', color: 'bg-amber-100 text-amber-700' },
  { name: 'Sarah Shah', title: 'Assignment Title 4', class: 'Class 6', status: 'Graded', color: 'bg-amber-100 text-amber-700' },
  { name: 'Abdulah Shan', title: 'Assignment Title 5', class: 'Class 9', status: 'Graded', color: 'bg-amber-100 text-amber-700' },
];

export default function HomeworkSubmissionsTable() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Recent Homework Submissions</h3>
        </div>
        <button className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600 flex items-center gap-1 font-semibold">
          This Month <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 border-b border-slate-100">
              <th className="pb-2 font-bold">Student Name</th>
              <th className="pb-2 font-bold">Assignment Title</th>
              <th className="pb-2 font-bold">Class</th>
              <th className="pb-2 font-bold">Grade/Status</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
            {SUBMISSIONS.map((row, i) => (
              <tr key={i}>
                <td className="py-2">{row.name}</td>
                <td className="py-2 text-slate-500">{row.title}</td>
                <td className="py-2">{row.class}</td>
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