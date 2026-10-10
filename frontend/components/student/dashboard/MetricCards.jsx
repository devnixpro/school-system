"use client";
import React from 'react';
import { 
  Star, 
  FileText, 
  CalendarDays, 
  Clock, 
  Receipt, 
  FileSpreadsheet, 
  AlertTriangle, 
  Calendar 
} from 'lucide-react';

const METRICS = [
  {
    title: 'My Overall Grades',
    value: '3.8 GPA',
    subtext: 'vs. last month',
    icon: Star,
    iconBg: 'bg-emerald-500',
    valueColor: 'text-slate-800'
  },
  {
    title: 'Pending Assignments',
    value: '5',
    tag: '5 Due Soon',
    subtext: 'vs. last month',
    icon: FileText,
    iconBg: 'bg-sky-500',
    tagColor: 'text-rose-500 font-semibold'
  },
  {
    title: 'Classes Today',
    value: '4',
    tag: '↑ Scheduled',
    subtext: 'vs last month',
    icon: CalendarDays,
    iconBg: 'bg-amber-500',
    tagColor: 'text-amber-600 font-semibold'
  },
  {
    title: 'Attendance',
    value: '94%',
    icon: Clock,
    iconBg: 'bg-emerald-500'
  },
  {
    title: 'Fee Collection (Today)',
    value: 'Rs. 285,000',
    tag: '↑ 18%',
    subtext: 'vs. yesterday',
    icon: Receipt,
    iconBg: 'bg-rose-500',
    tagColor: 'text-emerald-600 font-semibold'
  },
  {
    title: 'Outstanding Free',
    value: 'Rs. 1,245,000',
    subtext: '12% of total dues',
    icon: FileSpreadsheet,
    iconBg: 'bg-emerald-500'
  },
  {
    title: 'Fee Defaulters',
    value: '186',
    tag: '↑ 6%',
    subtext: 'vs last month',
    icon: AlertTriangle,
    iconBg: 'bg-rose-500',
    tagColor: 'text-emerald-600 font-semibold'
  },
  {
    title: 'Upcoming Events',
    value: '12',
    subtext: 'Next: 25 Jun 2025',
    icon: Calendar,
    iconBg: 'bg-indigo-500'
  }
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3.5 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-full ${item.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-500 truncate block">{item.title}</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-extrabold text-slate-900 leading-none">{item.value}</span>
                {item.tag && <span className={`text-[10px] ${item.tagColor}`}>{item.tag}</span>}
              </div>
              {item.subtext && <span className="text-[10px] text-slate-400 font-medium block mt-1">{item.subtext}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}