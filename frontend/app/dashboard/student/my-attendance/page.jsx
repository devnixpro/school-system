"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import AttendanceStats from "@/components/student/attendance/AttendanceStats";
import AttendanceTable from "@/components/student/attendance/AttendanceTable";

export default function StudentAttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Jab tak auth status load ho raha hai, wait karein
    if (authLoading) return;

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const studentId = user?._id || user?.id;

        // Agar studentId maujood hai toh specific route, warna base summary route
        const endpoint = studentId ? `/attendance/summary/${studentId}` : "/attendance/summary";
        const response = await api.get(endpoint);

        if (response.data?.success) {
          const data = response.data.data;
          setAttendanceData(data.records || []);
          setSummary(data.summary || { total: 0, present: 0, absent: 0, percentage: 0 });
        }
      } catch (err) {
        console.error("Error fetching attendance summary, using mock fallback:", err);
        setError("Could not load live attendance. Showing sample records.");
        
        // Fallback Mock Data
        const mockRecords = [
          { _id: "1", date: "2026-11-01", status: "Present", remarks: "On time" },
          { _id: "2", date: "2026-11-02", status: "Present", remarks: "On time" },
          { _id: "3", date: "2026-11-03", status: "Absent", remarks: "Sick leave" },
          { _id: "4", date: "2026-11-04", status: "Present", remarks: "On time" },
        ];
        setAttendanceData(mockRecords);
        setSummary({ total: 4, present: 3, absent: 1, percentage: 75 });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAttendance();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your daily attendance record and overall percentage.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Summary Stat Cards Component */}
      <AttendanceStats summary={summary} />

      {/* Attendance History Table Component */}
      <AttendanceTable records={attendanceData} />
    </div>
  );
}