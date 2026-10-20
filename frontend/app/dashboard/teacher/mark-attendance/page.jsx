'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle2, XCircle, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';


const MOCK_CLASSES = [
  { id: "10-a", name: "Grade 10 - Section A" },
  { id: "10-b", name: "Grade 10 - Section B" },
  { id: "9-a", name: "Grade 9 - Section A" },
  { id: "11-sci", name: "Grade 11 - Science" },
];

export default function MarkAttendancePage() {
  const [selectedClass, setSelectedClass] = useState('10-a');
  const [attendanceDate, setAttendanceDate] = useState('2026-09-27');
  const [students, setStudents] = useState([]);
  const [isExistingRecord, setIsExistingRecord] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // GET API Calling
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/attendance', {
        params: {
          classId: selectedClass,
          date: attendanceDate,
        },
      });

      const data = response.data?.students || response.data || [];
      setStudents(data);
      
      setIsExistingRecord(response.data?.isExisting || false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Attendance data fetching error.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, attendanceDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleAttendanceToggle = (id, newStatus) => {
    setStudents(prev =>
      prev.map(student => student.id === id ? { ...student, status: newStatus } : student)
    );
  };

  // POST and PUT API Calling
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      classId: selectedClass,
      date: attendanceDate,
      attendanceData: students.map(s => ({
        studentId: s.id,
        status: s.status,
      })),
    };

    try {
      if (isExistingRecord) {
        await api.put('/attendance', payload);
      } else {
        await api.post('/attendance', payload);
        setIsExistingRecord(true);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Attendance saveing error";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        {saved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            {isExistingRecord ? "Attendance Updated Successfully!" : "Attendance Saved Successfully!"}
          </span>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Class Attendance Register</h1>
          <p className="text-xs text-slate-500">
            {isExistingRecord ? "Existing attendance register update it" : "New student presence status mark and save it"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {MOCK_CLASSES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || students.length === 0}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Processing..." : isExistingRecord ? "Update Attendance" : "Save Attendance"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
          {error}
        </div>
      )}

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs font-semibold">Student records is loading</span>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              Not Found.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Roll No</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right pr-6">Quick Toggles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-700">{student.roll}</td>
                    <td className="p-4 text-slate-900 font-semibold">{student.name}</td>
                    <td className="p-4 text-xs text-slate-400">{student.id}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        student.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                        student.status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status === 'Present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {student.status === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                        {student.status === 'Leave' && <Clock className="w-3.5 h-3.5" />}
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        {['Present', 'Absent', 'Leave'].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleAttendanceToggle(student.id, st)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              student.status === st
                                ? st === 'Present' ? 'bg-emerald-600 text-white shadow-sm' :
                                  st === 'Absent' ? 'bg-rose-600 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}