"use client";
import React, { useState } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, User, Menu } from 'lucide-react';
import GraduationCapIcon from '@/public/GraduationCapIcon';

export default function Header({ isCollapsed, setIsCollapsed }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <header className="h-16 bg-[#0f111a] border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40 w-full">
     
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="flex items-center gap-3">
          <GraduationCapIcon className="w-14 h-14 text-sky-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl leading-tight text-white tracking-wide">
              DevNix<span className="text-sky-400">Edu</span>
            </span>
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
              Smart School Management
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teachers, classes, or anything..."
            className="w-full bg-[#181b28] text-xs text-slate-200 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-700/50 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-600">
            {loading ? (
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-100 leading-tight">
              {user?.name || "Zoya Ali"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium capitalize">
              {user?.role || "Student"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block cursor-pointer" />
        </div>
      </div>
    </header>
  );
}