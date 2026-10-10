"use client";
import React from 'react';
import { Calendar } from 'lucide-react';

const EVENTS = [
  { date: '20', month: 'Jun', title: 'Class 6-A History Test', time: '10:00 AA - Class Rovoms', tag: 'Event', tagColor: 'bg-emerald-100 text-emerald-700' },
  { date: '22', month: 'Jun', title: 'Class 6-A History Test', time: '10:00 AM - Main Mall', tag: 'Meeting', tagColor: 'bg-sky-100 text-sky-700' },
  { date: '25', month: 'Jun', title: 'Class 6-A History Test', time: '8:00 AM - Class Rooms', tag: 'Exam', tagColor: 'bg-purple-100 text-purple-700' },
  { date: '01', month: 'Jun', title: 'Summer Vaction', time: 'All Day - School School', tag: 'Holiday', tagColor: 'bg-amber-100 text-amber-700' },
];

export default function UpcomingEvents() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800">Upcoming Events</h3>
        </div>
        <button className="text-[11px] text-sky-600 font-semibold hover:underline">View All</button>
      </div>

      <div className="space-y-2.5">
        {EVENTS.map((ev, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-10 rounded-xl bg-sky-50 text-sky-600 flex flex-col items-center justify-center font-bold leading-none border border-sky-100">
                <span className="text-xs">{ev.date}</span>
                <span className="text-[9px] uppercase font-medium">{ev.month}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{ev.time}</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${ev.tagColor}`}>
              {ev.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}