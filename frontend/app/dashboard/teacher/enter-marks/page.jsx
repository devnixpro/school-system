"use client";
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Link from 'next/link';

const INITIAL_STUDENTS = [
  { id: "STD-101", roll: "01", name: "Ali Raza", score: 85 },
  { id: "STD-102", roll: "02", name: "Ayesha Khan", score: 92 },
  { id: "STD-103", roll: "03", name: "Bilal Hussain", score: 64 },
  { id: "STD-104", roll: "04", name: "Fatima Noor", score: 78 },
  { id: "STD-105", roll: "05", name: "Hamza Malik", score: 88 },
  { id: "STD-106", roll: "06", name: "Zainab Fatima", score: 95 },
];

const calculateGrade = (score) => {
  if (score >= 90) return { grade: 'A+', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (score >= 80) return { grade: 'A', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  if (score >= 70) return { grade: 'B', color: 'text-blue-600 bg-blue-50 border-blue-100' };
  if (score >= 60) return { grade: 'C', color: 'text-amber-600 bg-amber-50 border-amber-100' };
  if (score >= 50) return { grade: 'D', color: 'text-orange-600 bg-orange-50 border-orange-100' };
  return { grade: 'F', color: 'text-rose-600 bg-rose-50 border-rose-100' };
};

export default function EnterMarksPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [saved, setSaved] = useState(false);

  const handleScoreChange = (id, newScore) => {
    const val = Math.max(0, Math.min(100, Number(newScore) || 0));
    setStudents(prev =>
      prev.map(student => student.id === id ? { ...student, score: val } : student)
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        {saved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Marks Published Successfully!
          </span>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Marks & Examination Entry</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none">
            <option>Mid-Term Examination 2026</option>
            <option>Quiz Test #2</option>
            <option>Final Physics Practical</option>
          </select>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save & Publish Marks
          </button>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4 pl-6">Roll No</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Obtained Marks (/100)</th>
              <th className="p-4 text-center">Calculated Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.map((student) => {
              const gradeObj = calculateGrade(student.score);
              return (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-700">{student.roll}</td>
                  <td className="p-4 text-slate-900 font-semibold">{student.name}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={student.score}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      className="w-24 px-3 py-1.5 text-sm bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black border ${gradeObj.color}`}>
                      Grade {gradeObj.grade}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}