"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

const gradeFromPercentage = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  return "F";
};

export default function PublishResultModal({ exam, onClose, onSubmit }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadStudents() {
      try {
        const firstPage = await api.get("/students", {
          params: { class: exam.className, isActive: true, limit: 100, page: 1 },
        });
        const totalPages = firstPage.data.totalPages || 1;
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            api.get("/students", {
              params: { class: exam.className, isActive: true, limit: 100, page: index + 2 },
            })
          )
        );
        const allStudents = [
          ...(firstPage.data.data || []),
          ...remainingPages.flatMap(({ data }) => data.data || []),
        ];
        const matching = allStudents.filter(
          (student) => student.class === exam.className &&
            (!exam.section || (student.section || "") === exam.section)
        );
        if (active) {
          setStudents(matching);
          const firstStudentId = matching[0]?._id || "";
          setStudentId(firstStudentId);
          const existingResult = exam.results?.find(
            (result) => String(result.studentId) === firstStudentId
          );
          setObtainedMarks(existingResult ? String(existingResult.obtainedMarks) : "");
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || "Unable to load students for this exam.");
      } finally {
        if (active) setLoadingStudents(false);
      }
    }

    loadStudents();
    return () => { active = false; };
  }, [exam.className, exam.section, exam.results]);

  const percentage = obtainedMarks !== "" ? Math.round((Number(obtainedMarks) / exam.totalMarks) * 100) : null;
  const grade = percentage !== null ? gradeFromPercentage(percentage) : null;
  const selectedResult = exam.results?.find(
    (result) => String(result.studentId) === studentId
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(exam._id, { studentId, obtainedMarks: Number(obtainedMarks), grade });
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to publish result.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-brand-navy">Publish Result</h2>
          <button type="button" onClick={onClose} className="text-xl leading-none text-gray-400 hover:text-gray-700" aria-label="Close">×</button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <div className="text-sm text-gray-500">{exam.subject} · {exam.examType}</div>
            <div className="mt-0.5 text-xs text-gray-400">{[exam.className, exam.section].filter(Boolean).join(" - ")}</div>
          </div>

          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <label className="block text-xs font-semibold text-gray-600">
            Student
            <select
              required
              value={studentId}
              onChange={(event) => {
                const nextStudentId = event.target.value;
                setStudentId(nextStudentId);
                const existingResult = exam.results?.find(
                  (result) => String(result.studentId) === nextStudentId
                );
                setObtainedMarks(existingResult ? String(existingResult.obtainedMarks) : "");
              }}
              disabled={loadingStudents || !students.length}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal text-gray-800"
            >
              {loadingStudents ? <option value="">Loading students...</option> : null}
              {!loadingStudents && students.length === 0 ? <option value="">No students in this class</option> : null}
              {students.map((student) => (
                <option key={student._id} value={student._id}>{student.name} · {student.rollNumber}</option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-gray-600">
            Obtained Marks (out of {exam.totalMarks})
            <input
              required
              type="number"
              min="0"
              max={exam.totalMarks}
              step="0.01"
              value={obtainedMarks}
              onChange={(event) => setObtainedMarks(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </label>

          {percentage !== null && Number.isFinite(percentage) && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-600">{percentage}%</span>
              <span className="font-bold text-brand-blue">Grade {grade}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving || loadingStudents || !students.length} className="flex-1 rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60">
              {saving ? "Publishing..." : selectedResult ? "Update result" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
