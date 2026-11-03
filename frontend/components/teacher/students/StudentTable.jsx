import { Eye, Edit, Trash2 } from "lucide-react";

export default function StudentsTable({ students, totalCount }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Roll No</th>
              <th className="p-4">Class</th>
              <th className="p-4">Parent Contact</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length > 0 ? (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {student.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600">
                    #{student.rollNo}
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200">
                      {student.class}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {student.parentContact}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            parseInt(student.attendance) >= 90
                              ? "bg-emerald-500"
                              : parseInt(student.attendance) >= 80
                              ? "bg-sky-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: student.attendance }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-700">
                        {student.attendance}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        student.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          student.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      ></span>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="View Profile"
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Student"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-slate-500 text-xs"
                >
                  No students found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>
          Showing <span className="font-semibold text-slate-800">{students.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{totalCount}</span> students
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-500 transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}