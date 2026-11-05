"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  CalendarCheck,
  Download,
  Headphones
} from "lucide-react";

export default function TeacherTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [viewMode, setViewMode] = useState("day");

  const [rawTimetable, setRawTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = [
    { id: "Monday", label: "Monday", isToday: true },
    { id: "Tuesday", label: "Tuesday" },
    { id: "Wednesday", label: "Wednesday" },
    { id: "Thursday", label: "Thursday" },
    { id: "Friday", label: "Friday" },
  ];

  // Fetching timetable data using GET /api/timetable endpoint for teachers
  useEffect(() => {
    async function fetchTeacherTimetable() {
      try {
        setLoading(true);
        setError(null);
        
        // Teacher ke liye API call (Aap yahan teacher ID ya teacher name pass kar sakte hain agar required ho)
        const response = await api.get("/timetable");
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setRawTimetable(dataArray);
      } catch (err) {
        console.error("Error fetching teacher timetable:", err);
        setError(err.response?.data?.message || "Failed to load timetable data from server.");
      } finally {
        setLoading(false);
      }
    }

    fetchTeacherTimetable();
  }, []);

  // Filter active day periods for Teacher
  const activeDayPeriods = rawTimetable
    .filter(item => item.day?.toLowerCase() === selectedDay.toLowerCase())
    .map((item, index) => ({
      id: item._id,
      subject: item.subject,
      className: `Class ${item.className} - Section ${item.section}`,
      time: `${item.startTime} - ${item.endTime}`,
      room: item.roomNo,
      badgeColor: index % 2 === 0 ? "#1B63E0" : "#059669",
    }));

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-800 p-4 md:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E36]">Teacher Schedule & Timetable</h1>
          <p className="text-sm text-slate-500">
            View your daily lecture timings, assigned classes, and room allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Day / Week View Toggle */}
          <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === "day"
                  ? "bg-[#1B63E0] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === "week"
                  ? "bg-[#1B63E0] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Full Week
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B63E0] hover:bg-[#1552BD] rounded-xl shadow-md shadow-blue-500/20 transition">
            <Download className="w-4 h-4" /> Export Schedule
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm my-6">
          <Loader2 className="w-10 h-10 text-[#1B63E0] animate-spin mb-3" />
          <p className="text-sm font-semibold text-[#0B1E36]">Loading teacher schedule...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 my-6 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Unable to load timetable</h4>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            
            {viewMode === "day" ? (
              <>
                {/* Day Selector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
                  {days.map((day) => {
                    const isSelected = selectedDay === day.id;
                    return (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDay(day.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                          isSelected
                            ? "bg-[#0B1E36] text-white shadow-md shadow-slate-900/10"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>

                {/* Lectures List */}
                {activeDayPeriods.length > 0 ? (
                  <div className="space-y-3">
                    {activeDayPeriods.map((period) => (
                      <div
                        key={period.id}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-3 h-12 rounded-full"
                            style={{ backgroundColor: period.badgeColor }}
                          ></div>
                          <div>
                            <h3 className="font-bold text-base text-[#0B1E36]">{period.subject}</h3>
                            <p className="text-xs font-semibold text-[#1B63E0] mt-0.5">{period.className}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <Clock className="w-3.5 h-3.5 text-[#1B63E0]" />
                            <span>{period.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{period.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                    <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0B1E36]">No Lectures Scheduled</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      You have no classes assigned for <span className="font-semibold capitalize">{selectedDay}</span>.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Full Week View Box */
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center py-16">
                <Calendar className="w-12 h-12 text-[#1B63E0] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#0B1E36]">Full Weekly Matrix</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Weekly schedule overview displays all your assigned teaching hours across various sections.
                </p>
              </div>
            )}

          </div>

          {/* Right Sidebar Summary */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0B1E36] border-b border-slate-100 pb-3">
                Workload Summary
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <BookOpen className="w-4 h-4 text-[#1B63E0]" />
                    <span>Today's Lectures</span>
                  </div>
                  <span className="font-bold text-sm text-[#0B1E36]">{activeDayPeriods.length} Classes</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Status</span>
                  </div>
                  <span className="font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Active Faculty
                  </span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-b from-[#0B1E36] to-[#0D233A] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Headphones className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Schedule Conflict?</h4>
                  <p className="text-xs text-slate-300">Contact administration</p>
                </div>
              </div>
              <button className="w-full mt-2 py-2 text-xs font-semibold bg-[#1B63E0] hover:bg-[#1552BD] text-white rounded-xl transition shadow">
                Request Adjustment
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}