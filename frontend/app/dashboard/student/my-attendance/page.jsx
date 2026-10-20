"use client";
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  AlertTriangle, 
  Loader2, 
  Filter,
  BookOpen
} from 'lucide-react';
import api from '@/services/api';

export default function StudentAttendancePage({ studentId = "123" }) {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('all');

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        const response = await api.get(`/attendance/summary/${studentId}`);
        setAttendanceData(response.data?.data || response.data);
      } catch (err) {
        console.error("Error fetching attendance summary, using mock fallback:", err);
        // Fallback Mock Data for UI Testing
        setAttendanceData({
          overallPercentage: 87.5,
          totalClasses: 120,
          presentCount: 105,
          absentCount: 10,
          lateCount: 5,
          logs: [
            { id: "1", date: "2026-10-01", subject: "Mathematics", status: "PRESENT", remarks: "On time" },
            { id: "2", date: "2026-10-01", subject: "Physics", status: "PRESENT", remarks: "On time" },
            { id: "3", date: "2026-09-30", subject: "Computer Science", status: "LATE", remarks: "10 mins late" },
            { id: "4", date: "2026-09-29", subject: "Chemistry", status: "ABSENT", remarks: "Medical leave" },
            { id: "5", date: "2026-09-28", subject: "English", status: "PRESENT", remarks: "On time" },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [studentId]);

  const filteredLogs = attendanceData?.logs?.filter(log => {
    if (selectedMonth === 'all') return true;
    return log.date.startsWith(selectedMonth);
  }) || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Late
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold">Attendance summary load ho raha hai...</span>
      </div>
    );
  }

  const isLowAttendance = (attendanceData?.overallPercentage || 0) < 75;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Attendance Summary</h1>
          <p className="text-xs text-slate-500 mt-1">Track daily class presence and performance report</p>
        </div>

        {isLowAttendance && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Attendance below 75%! Please attend upcoming classes.</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Attendance Rate</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className={`text-3xl font-black ${isLowAttendance ? 'text-amber-600' : 'text-slate-800'}`}>
              {attendanceData?.overallPercentage}%
            </span>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isLowAttendance ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${attendanceData?.overallPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Conducted</span>
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-800">{attendanceData?.totalClasses}</span>
            <p className="text-[11px] text-slate-500 mt-1">Total classes held</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Present</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-600">{attendanceData?.presentCount}</span>
            <p className="text-[11px] text-slate-500 mt-1">Attended sessions</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Absent / Late</span>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-rose-600">{attendanceData?.absentCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Absents</span>
            <span className="text-xs text-amber-600 font-bold">({attendanceData?.lateCount} Late)</span>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Class Logs</h2>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Months</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Subject</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    No record found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 text-slate-800 font-bold">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">{log.subject}</td>
                    <td className="py-3.5 px-5">{getStatusBadge(log.status)}</td>
                    <td className="py-3.5 px-5 text-slate-500 font-normal">{log.remarks || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}