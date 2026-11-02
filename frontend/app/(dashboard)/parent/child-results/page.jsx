'use client';

import { useEffect, useState } from 'react';
import ChildSwitcher from '@/components/parent/ChildSwitcher';
import useSelectedChild from '@/components/parent/useSelectedChild';
import { parentService } from '@/services/parentService';

export default function ChildResultsPage() {
  const { childList, selectedId, select, loading, error } = useSelectedChild();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    parentService
      .getResults(selectedId)
      .then((data) => !cancelled && setResponse({ childId: selectedId, data, error: '' }))
      .catch((error) => !cancelled && setResponse({ childId: selectedId, data: null, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const currentResponse = response?.childId === selectedId ? response : null;
  const exams = currentResponse?.data || null;
  const fetchError = currentResponse?.error || '';

  if (loading) return <p className="p-6 text-slate-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!childList.length) return <p className="p-6 text-slate-600">No children are linked to this parent account yet.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-navy">Results</h1>
      <ChildSwitcher childList={childList} selectedId={selectedId} onChange={select} />

      {fetchError && <p className="text-red-600">{fetchError}</p>}
      {!exams && !fetchError && <p className="text-slate-500">Loading results...</p>}

      {exams && exams.length === 0 && (
        <p className="text-slate-600">No results have been published for this child yet.</p>
      )}

      {exams && exams.length > 0 && (
        <div className="space-y-6">
          {exams.map((exam) => (
            <section key={exam.examId} className="space-y-2">
              <h2 className="text-lg font-semibold text-navy">
                {exam.name}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {new Date(exam.date).toLocaleDateString()}
                </span>
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="px-4 py-2 font-medium">Subject</th>
                      <th className="px-4 py-2 font-medium">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.subjects.map((s) => (
                      <tr key={s.subject} className="border-t border-slate-200">
                        <td className="px-4 py-2">{s.subject}</td>
                        <td className="px-4 py-2">
                          {s.marksObtained}
                          {s.totalMarks ? ` / ${s.totalMarks}` : ''}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-slate-200 bg-slate-50 font-medium">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2">{exam.totalObtained}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
