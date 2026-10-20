"use client";
import { useEffect, useState } from "react";
import ExamCard from "@/components/common/ExamCard";
import { examService } from "@/services/examService";

export default function StudentExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService
      .list({ limit: 50 })
      .then((res) => setExams(res.data || []))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = exams
    .filter((e) => e.status === "upcoming" || e.status === "ongoing")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const declared = exams
    .filter((e) => e.status === "result-declared")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const avgPercentage = declared.length
    ? Math.round(
        declared.reduce((s, e) => s + (e.obtainedMarks / e.totalMarks) * 100, 0) / declared.length
      )
    : null;

  return (
    <main className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-brand-navy">Exams &amp; Results</h1>
        <p className="text-gray-500 text-sm mt-1">Your upcoming exam schedule and declared results.</p>
      </header>

      {!loading && exams.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border bg-blue-50 border-blue-200 p-5">
            <div className="text-[11px] font-semibold uppercase text-blue-700">Upcoming Exams</div>
            <div className="text-2xl font-bold text-blue-900 mt-2">{upcoming.length}</div>
            <div className="text-xs text-gray-500 mt-1">Scheduled ahead</div>
          </div>
          <div className="rounded-2xl border bg-green-50 border-green-200 p-5">
            <div className="text-[11px] font-semibold uppercase text-green-700">Results Declared</div>
            <div className="text-2xl font-bold text-green-900 mt-2">{declared.length}</div>
            <div className="text-xs text-gray-500 mt-1">This term</div>
          </div>
          <div className="rounded-2xl border bg-gray-50 border-gray-200 p-5">
            <div className="text-[11px] font-semibold uppercase text-gray-700">Average Score</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{avgPercentage !== null ? `${avgPercentage}%` : "—"}</div>
            <div className="text-xs text-gray-500 mt-1">Across declared results</div>
          </div>
        </section>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">Loading…</div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">No exams yet</h3>
          <p className="text-sm text-gray-500">Your school hasn&apos;t scheduled any exams yet.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="font-semibold text-brand-navy mb-3">Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map((e) => (
                  <ExamCard key={e._id} exam={e} />
                ))}
              </div>
            </section>
          )}
          {declared.length > 0 && (
            <section>
              <h2 className="font-semibold text-brand-navy mb-3">Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {declared.map((e) => (
                  <ExamCard key={e._id} exam={e} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
