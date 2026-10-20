"use client";
import React from 'react';
import { Activity, MessageSquare, UserCheck, CheckCircle } from 'lucide-react';

const ACTIVITIES = [
  { text: 'Mr. Khan posted Math Assignment for Class 6-A', time: '12 minutes ago', icon: MessageSquare, iconBg: 'bg-emerald-500' },
  { text: 'Your Grade for English Essay was updated.', time: '12 minutes ago', icon: UserCheck, iconBg: 'bg-sky-500' },
  { text: 'Your Grade for English Essay was updated.', time: '12 minutes ago', icon: Activity, iconBg: 'bg-purple-500' },
  { text: 'Your Grade for English Essay was updated.', time: '12 minutes ago', icon: CheckCircle, iconBg: 'bg-amber-500' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Recent Activity</h3>
        </div>
        <button className="text-[11px] text-sky-600 font-semibold hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {ACTIVITIES.map((act, i) => {
          const Icon = act.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full ${act.iconBg} text-white flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{act.text}</p>
                <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}