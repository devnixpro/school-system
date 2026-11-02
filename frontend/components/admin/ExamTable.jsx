"use client";
import ExamStatusBadge from "@/components/common/ExamStatusBadge";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function ExamTable({ exams = [], onEdit, onDelete, onPublishResult }) {
  if (!exams.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">No exams scheduled</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">Schedule your first exam to see it listed here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Subject", "Type", "Class", "Date", "Marks", "Status", "Actions"].map((h, i) => (
                <th key={h} className={`px-5 py-3 font-semibold text-[11px] uppercase text-gray-500 ${i === 4 || i === 6 ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.map((exam) => (
              <tr key={exam._id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 font-medium text-gray-900">{exam.subject}</td>
                <td className="px-5 py-3.5 text-gray-600">{exam.examType}</td>
                <td className="px-5 py-3.5 text-gray-600">{exam.className}</td>
                <td className="px-5 py-3.5 text-gray-600">{formatDate(exam.date)}</td>
                <td className="px-5 py-3.5 text-right text-gray-800">
                  {exam.status === "result-declared" ? `${exam.obtainedMarks}/${exam.totalMarks}` : `— /${exam.totalMarks}`}
                </td>
                <td className="px-5 py-3.5"><ExamStatusBadge status={exam.status} size="sm" /></td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {onPublishResult && exam.status !== "result-declared" && (
                      <button onClick={() => onPublishResult(exam)} className="text-brand-blue hover:bg-blue-50 px-2 py-1 rounded-lg text-xs font-semibold">Publish Result</button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(exam)} className="text-gray-500 hover:text-brand-blue px-2 py-1 rounded-lg hover:bg-gray-100 text-xs font-medium">Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(exam)} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-medium">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
