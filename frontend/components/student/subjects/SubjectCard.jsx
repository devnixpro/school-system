"use client";

import React from "react";
import { BookOpen, User, Clock, FileText, ArrowRight } from "lucide-react";

export default function SubjectCard({ subj }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between space-y-4">
      <div>
        {/* Top Card Info */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{subj.name}</h3>
              <span className="text-[11px] font-mono font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                {subj.code}
              </span>
            </div>
          </div>

          {subj.grade && (
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-xl">
              Grade: {subj.grade}
            </span>
          )}
        </div>

        {/* Details Section */}
        <div className="mt-4 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span>Instructor: <strong className="text-slate-800">{subj.instructor}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Schedule: <strong className="text-slate-800">{subj.schedule}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Lectures: <strong className="text-slate-800">{subj.lecturesCompleted} / {subj.totalLectures} Completed</strong></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Course Progress</span>
            <span className="text-sky-600">{subj.progress}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 rounded-full transition-all duration-500"
              style={{ width: subj.progress }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Semester 2026</span>
        <button className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-semibold transition">
          View Materials <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}