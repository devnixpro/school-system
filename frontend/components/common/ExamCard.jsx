"use client";
import ExamStatusBadge from "./ExamStatusBadge";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const gradeColor = (grade) => {
  if (!grade) return "text-gray-900";
  if (["A+", "A"].includes(grade)) return "text-green-600";
  if (["B+", "B"].includes(grade)) return "text-brand-blue";
  if (["C+", "C"].includes(grade)) return "text-yellow-600";
  return "text-red-600";
};

export default function ExamCard({ exam }) {
  const isDeclared = exam.status === "result-declared";
  const percentage =
    isDeclared && exam.totalMarks ? Math.round((exam.obtainedMarks / exam.totalMarks) * 100) : null;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
      <header className="p-5 pb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">{exam.subject}</h3>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {exam.examType} · {exam.className}
          </p>
        </div>
        <ExamStatusBadge status={exam.status} />
      </header>

      {isDeclared ? (
        <div className="px-5 pb-4 flex items-end gap-3">
          <div className={`text-2xl font-bold ${gradeColor(exam.grade)}`}>
            {exam.obtainedMarks}
            <span className="text-sm text-gray-400 font-medium">/{exam.totalMarks}</span>
          </div>
          {exam.grade && (
            <span className={`text-sm font-bold pb-0.5 ${gradeColor(exam.grade)}`}>Grade {exam.grade}</span>
          )}
          {percentage !== null && <span className="text-xs text-gray-400 pb-1 ml-auto">{percentage}%</span>}
        </div>
      ) : (
        <div className="px-5 pb-4">
          <div className="text-sm text-gray-500">Total Marks: <span className="font-semibold text-gray-800">{exam.totalMarks}</span></div>
        </div>
      )}

      <dl className="px-5 pb-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4">
        <div>
          <dt className="text-[11px] uppercase text-gray-400">Date</dt>
          <dd className="text-gray-800 font-medium mt-0.5">{formatDate(exam.date)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-gray-400">Time</dt>
          <dd className="text-gray-800 font-medium mt-0.5">
            {exam.startTime || "—"} {exam.duration ? `· ${exam.duration}m` : ""}
          </dd>
        </div>
      </dl>
    </article>
  );
}
