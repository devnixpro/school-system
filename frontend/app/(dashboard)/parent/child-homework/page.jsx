'use client';

import { useCallback } from 'react';
import ChildSwitcher from '@/components/parent/ChildSwitcher';
import useSelectedChild from '@/components/parent/useSelectedChild';
import useAsyncData from '@/hooks/useAsyncData';
import { parentService } from '@/services/parentService';

export default function ChildHomeworkPage() {
  const { childList, selectedId, select, loading, error } = useSelectedChild();
  const request = useCallback(
    () => parentService.getHomework(selectedId),
    [selectedId]
  );
  const { data: homework, error: fetchError, loading: dataLoading } =
    useAsyncData(selectedId || "", request);

  if (loading) return <p className="p-6 text-slate-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-navy">Homework</h1>
      <ChildSwitcher childList={childList} selectedId={selectedId} onChange={select} />

      {fetchError && <p className="text-red-600">{fetchError}</p>}
      {dataLoading && <p className="text-slate-500">Loading homework...</p>}

      {homework && homework.length === 0 && (
        <p className="text-slate-600">No homework has been assigned to this class yet.</p>
      )}

      {homework && homework.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-4 py-2 font-medium">Subject</th>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Due date</th>
              </tr>
            </thead>
            <tbody>
              {homework.map((h) => (
                <tr key={h._id} className="border-t border-slate-200">
                  <td className="px-4 py-2">{h.subject}</td>
                  <td className="px-4 py-2">{h.title}</td>
                  <td className="px-4 py-2">
                    {h.dueDate ? new Date(h.dueDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
