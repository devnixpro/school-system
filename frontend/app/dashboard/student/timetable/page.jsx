"use client";

import React, { useState, useEffect } from "react";
import TimetableHeader from "@/components/student/timtable/TimetableHeader";
import DaySelector from "@/components/student/timtable/DaySelector";
import PeriodCard from "@/components/student/timtable/PeriodCard";
import WeekGrid from "@/components/student/timtable/WeekGrid";
import api from "@/services/api";
import { Headphones, BookOpen, Clock, CalendarCheck, Loader2, AlertCircle } from "lucide-react";

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [viewMode, setViewMode] = useState("day");

  // API states
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

  // Fetching timetable data
  useEffect(() => {
    async function fetchTimetable() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/timetable");
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setRawTimetable(dataArray);
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError(err.response?.data?.message || "Failed to load timetable data from server.");
      } finally {
        setLoading(false);
      }
    }

    fetchTimetable();
  }, []);

  // 1. Filter active day periods from the flat array for Day View
  const activeDayPeriods = rawTimetable
    .filter(item => item.day.toLowerCase() === selectedDay.toLowerCase())
    .map((item, index) => ({
      id: item._id,
      subject: item.subject,
      code: `${item.subject.substring(0, 3).toUpperCase()}-${item.className}`,
      time: `${item.startTime} - ${item.endTime}`,
      duration: "60 mins",
      teacher: item.teacher,
      room: item.roomNo,
      badgeColor: index % 2 === 0 ? "#1B63E0" : "#059669",
      isCurrent: false,
    }));

  // 2. Prepare Weekly Matrix for Full Week Grid View
  const timeSlotsMap = {};
  rawTimetable.forEach(item => {
    const timeKey = `${item.startTime} - ${item.endTime}`;
    if (!timeSlotsMap[timeKey]) {
      timeSlotsMap[timeKey] = {
        time: timeKey,
        slots: [null, null, null, null, null] // Monday to Friday (5 slots)
      };
    }
    const dayIndex = days.findIndex(d => d.id.toLowerCase() === item.day.toLowerCase());
    if (dayIndex !== -1) {
      timeSlotsMap[timeKey].slots[dayIndex] = {
        subject: item.subject,
        room: item.roomNo,
      };
    }
  });

  const weeklySchedule = Object.values(timeSlotsMap);

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-800 p-4 md:p-6 font-sans">
      <TimetableHeader
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        viewMode={viewMode}
        setViewMode={setViewMode}
        days={days}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm my-6">
          <Loader2 className="w-10 h-10 text-[#1B63E0] animate-spin mb-3" />
          <p className="text-sm font-semibold text-[#0B1E36]">Loading class schedule...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 my-6 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Unable to load schedule</h4>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Timetable Display Section */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            
            {viewMode === "day" ? (
              <>
                <DaySelector
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  days={days}
                />

                {/* Period Cards List */}
                {activeDayPeriods.length > 0 ? (
                  <div className="space-y-3">
                    {activeDayPeriods.map((period) => (
                      <PeriodCard key={period.id} period={period} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center shadow-sm">
                    <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0B1E36]">No Classes Scheduled</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      There are no scheduled lectures or classes for <span className="font-semibold capitalize">{selectedDay}</span>.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Full Week Grid View */
              <WeekGrid weeklySchedule={weeklySchedule} days={days} />
            )}

          </div>

          {/* Sidebar Info Cards */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0B1E36] border-b border-slate-100 pb-3">
                Today's Overview
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <BookOpen className="w-4 h-4 text-[#1B63E0]" />
                    <span>Total Classes</span>
                  </div>
                  <span className="font-bold text-sm text-[#0B1E36]">
                    {activeDayPeriods.length} Periods
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Status</span>
                  </div>
                  <span className="font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#0B1E36] to-[#0D233A] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Headphones className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Timetable Query?</h4>
                  <p className="text-xs text-slate-300">Contact section coordinator</p>
                </div>
              </div>
              <button className="w-full mt-2 py-2 text-xs font-semibold bg-[#1B63E0] hover:bg-[#1552BD] text-white rounded-xl transition shadow">
                Contact Coordinator
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}