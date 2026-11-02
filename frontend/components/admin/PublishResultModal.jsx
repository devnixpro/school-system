"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

const gradeFromPercentage = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C+";
  if (pct >= 40) return "C";
  return "F";
};

export default function PublishResultModal({ exam, onClose, onSubmit }) {
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  useEffect(() => { api.get("/students", { params: { class: exam.className, limit: 500 } }).then(r => { const list = r.data?.data || []; setStudents(list); setStudentId(list[0]?._id || ""); }).catch(() => setStudents([])); }, [exam._id, exam.className]);
  const [saving, setSaving] = useState(false);

  const pct = obtainedMarks !== "" ? Math.round((Number(obtainedMarks) / exam.totalMarks) * 100) : null;
  const grade = pct !== null ? gradeFromPercentage(pct) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(exam._id, { studentId, obtainedMarks: Number(obtainedMarks), grade });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-brand-navy text-lg">Publish Result</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="text-sm text-gray-500">{exam.subject} · {exam.examType}</div>
            <div className="text-xs text-gray-400 mt-0.5">{exam.className}</div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Student</label>
            <select required value={studentId} onChange={e => setStudentId(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" disabled={!students.length}>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber || s.rollNo})</option>)}
            </select>
            {!students.length && <p className="text-xs text-red-600 mt-1">No students found for this class. Check the class name and student records.</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Obtained Marks (out of {exam.totalMarks})</label>
            <input
              required
              type="number"
              min="0"
              max={exam.totalMarks}
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {pct !== null && !Number.isNaN(pct) && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">{pct}%</span>
              <span className="font-bold text-brand-blue">Grade {grade}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving || !studentId}
              className="flex-1 rounded-xl bg-brand-blue text-white py-2.5 text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-60">
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
