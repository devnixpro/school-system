"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  FileText,
  Calendar,
  Book,
  User,
  Settings,
  ChevronRight,
  Headphones
} from 'lucide-react';
import api from '@/services/api';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard/student', icon: Home },
  { name: 'My Subjects', href: '/dashboard/student/subjects', icon: BookOpen },
  { name: 'Assignments', href: '/dashboard/student/homework-assiengment', icon: ClipboardList },
  { name: 'My Attendance', href: '/dashboard/student/my-attendance', icon: CalendarCheck },
  { name: 'Marksheet & Grades', href: '/dashboard/student/exams', icon: FileText },
  { name: 'Timetable', href: '/dashboard/student/timetable', icon: Calendar },
  { name: 'Syllabus', href: '/dashboard/student/syllabus', icon: Book },
  { name: 'My Profile', href: '/dashboard/student/profile', icon: User },
  { name: 'Settings', href: '/dashboard/student/settings', icon: Settings }
];

export default function StudentSidebar({ isCollapsed }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data?.data || res.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <aside
      className={`bg-[#031130] text-white flex flex-col justify-between border-r border-slate-800/60 transition-all duration-300 relative p-3 h-screen overflow-y-auto select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="space-y-4 pt-2">
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>
                
                {/* {!isCollapsed && !isActive && (
                  <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 flex-shrink-0" />
                )} */}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 space-y-4">

        {!isCollapsed ? (
          <div className="bg-[#081b42] border border-blue-900/50 rounded-2xl p-4 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Need Help?</h4>
                <p className="text-[10px] text-slate-400">Our support team is here 24/7</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 rounded-xl transition-all shadow-md shadow-blue-600/30">
              Contact Support
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              title="Contact Support"
              className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
            >
              <Headphones className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* DevNix Edu Footer */}
        {!isCollapsed && (
          <div className="px-1 text-left space-y-0.5 pt-2 border-t border-slate-800/40">
            <p className="text-xs font-bold text-slate-200">
              DevNix Edu <span className="text-[10px] font-normal text-slate-400">v1.0</span>
            </p>
            <p className="text-[9px] text-slate-500">
              Smart Nixx Edu inc. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}