"use client";
import React from 'react';
import { 
  Zap, 
  Calendar, 
  UserPlus, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  MessageSquare 
} from 'lucide-react';

const ACTIONS = [
  { label: 'Schedule Quiz', icon: Calendar },
  { label: 'Post Assignment', icon: UserPlus },
  { label: 'View Syllabus', icon: FileText },
  { label: 'View Syllabus', icon: BookOpen },
  { label: 'My Marksheet', icon: GraduationCap },
  { label: 'Message Teachers', icon: MessageSquare },
  { label: 'Send Class Message', icon: MessageSquare, full: true }
];

export default function QuickActions() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-sky-600 fill-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Quick Actions</h3>
        </div>
        <button className="text-[11px] text-sky-600 font-semibold hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-all border border-slate-100 ${
                act.full ? 'col-span-1' : ''
              }`}
            >
              <Icon className="w-5 h-5 text-sky-600 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}