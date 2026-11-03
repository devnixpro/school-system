"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function ClassHeader({ onAddClick }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Classes & Subjects</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your assigned classes, syllabi, and subject progress.
        </p>
      </div>

      <button 
        onClick={onAddClick}
        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-sky-600/20"
      >
        <Plus className="w-4 h-4" /> Add Subject / Material
      </button>
    </div>
  );
}