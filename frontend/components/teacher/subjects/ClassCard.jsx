"use client";

import React from "react";
import { BookOpen, Users, GraduationCap } from "lucide-react";

export default function ClassCard({ cls }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        {/* Class Header info */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{cls.className}</h3>
              <span className="text-[11px] text-slate-500 font-medium">{cls.section}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>{cls.totalStudents} Students</span>
          </div>
        </div>

        {/* Subjects List under this Class */}
        <div className="mt-4 space-y-3">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Assigned Subjects
          </h4>
          
          <div className="space-y-2">
            {cls.subjects.map((sub, index) => (
              <div
                key={index}
                className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{sub.name}</p>
                    <span className="text-[10px] text-slate-500">Code: {sub.code} • {sub.lectures} Lectures</span>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="text-right">
                  <span className="text-xs font-bold text-sky-600">{sub.progress}</span>
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-sky-600 rounded-full" 
                      style={{ width: sub.progress }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Total Subjects: {cls.subjects.length}</span>
        <button className="text-xs text-sky-600 hover:text-sky-700 font-semibold transition">
          Manage Class →
        </button>
      </div>
    </div>
  );
}