import { FileText, Calendar, Eye, Download } from "lucide-react";

export default function ReportsTable({ reports, totalCount }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Report Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Class</th>
              <th className="p-4">Generated Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">File Size</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {report.title}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {report.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200">
                      {report.category}
                    </span>
                  </td>

                  <td className="p-4 text-slate-700 font-medium">
                    {report.class}
                  </td>

                  <td className="p-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {report.generatedDate}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        report.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : report.status === "Pending Review"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          report.status === "Completed"
                            ? "bg-emerald-500"
                            : report.status === "Pending Review"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      ></span>
                      {report.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-slate-500">
                    {report.fileSize}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View Report"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Download PDF"
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-slate-400 text-xs"
                >
                  No reports found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>
          Showing <span className="font-semibold text-slate-700">{reports.length}</span> of{" "}
          <span className="font-semibold text-slate-700">{totalCount}</span> reports
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}