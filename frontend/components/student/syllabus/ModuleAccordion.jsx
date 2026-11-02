"use client";

import React from 'react';
import { CheckCircle2, Clock, Circle, ChevronUp, ChevronDown, FileText } from 'lucide-react';

export default function ModuleAccordion({ module, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Module Header Toggle */}
      <div 
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-slate-50 flex items-center justify-between transition border-b border-transparent"
      >
        <div className="flex items-center gap-3">
          {module.status === 'Completed' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          ) : module.status === 'In Progress' ? (
            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
          )}

          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{module.title}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{module.duration}</span> • 
              <span className={`font-medium ${
                module.status === 'Completed' ? 'text-emerald-600' : 
                module.status === 'In Progress' ? 'text-amber-600' : 'text-slate-400'
              }`}>
                {module.status}
              </span>
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content (Topics & Resources) */}
      {isExpanded && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Topics Covered</p>
            <ul className="space-y-2">
              {module.topics?.map((topic, tIdx) => (
                <li key={tIdx} className="flex items-center gap-2.5 text-slate-700 text-xs sm:text-sm">
                  {topic.completed ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                  <span className={topic.completed ? 'line-through text-slate-400' : ''}>
                    {topic.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Download Resource Link */}
          {module.resources && (
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
                <FileText className="w-4 h-4" />
                {module.resources}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}