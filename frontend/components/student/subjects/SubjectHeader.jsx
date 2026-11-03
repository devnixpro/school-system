"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export default function SubjectHeader({ totalCount }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Enrolled Subjects</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Track your course progress, check lecture schedules, and view instructor details.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm text-xs font-semibold text-slate-700">
        <BookOpen className="w-4 h-4 text-sky-600" />
        <span>Total Enrolled: {totalCount} Subjects</span>
      </div>
    </div>
  );
}