"use client";

import React from 'react';

export default function SubjectCard({ subject, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition duration-150 flex flex-col gap-2 ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
          {subject.code}
        </span>
        <span className="text-xs text-slate-500 font-medium">{subject.progress}% Done</span>
      </div>

      <h3 className="font-semibold text-sm">{subject.name}</h3>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
          style={{ width: `${subject.progress}%` }}
        />
      </div>
    </button>
  );
}