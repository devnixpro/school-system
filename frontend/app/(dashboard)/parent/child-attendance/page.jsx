'use client';

import { useCallback, useState } from 'react';
import ChildSwitcher from '@/components/parent/ChildSwitcher';
import useSelectedChild from '@/components/parent/useSelectedChild';
import useAsyncData from '@/hooks/useAsyncData';
import { parentService } from '@/services/parentService';

const STATUS_STYLE = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-amber-100 text-amber-800',
  leave: 'bg-slate-100 text-slate-700',
};

const currentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

export default function ChildAttendancePage() {
  const { childList, selectedId, select, loading, error } = useSelectedChild();
  const [month, setMonth] = useState(currentMonth());
  const request = useCallback(
    () => parentService.getAttendance(selectedId, month),
    [selectedId, month]
  );
  const { data, error: fetchError, loading: dataLoading } = useAsyncData(
    selectedId ? `${selectedId}:${month}` : "",
    request
  );

  if (loading) return <p className="p-6 text-slate-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-navy">Attendance</h1>
      <ChildSwitcher childList={childList} selectedId={selectedId} onChange={select} />

      <label className="block text-sm text-slate-700">
        Month
        <input
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
          className="ml-2 rounded border border-slate-300 px-2 py-1"
        />
      </label>

      {fetchError && <p className="text-red-600">{fetchError}</p>}
      {dataLoading && <p className="text-slate-500">Loading attendance...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ['Attendance', `${data.summary.percentage}%`],
              ['Present', data.summary.present],
              ['Absent', data.summary.absent],
              ['Late', data.summary.late],
              ['Leave', data.summary.leave],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-3">
                <p className="text-xl font-semibold text-navy">{value}</p>
                <p className="text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          {data.records.length === 0 ? (
            <p className="text-slate-600">No attendance recorded for this month.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((r) => (
                    <tr key={r._id} className="border-t border-slate-200">
                      <td className="px-4 py-2">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            STATUS_STYLE[r.status] || STATUS_STYLE.leave
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
