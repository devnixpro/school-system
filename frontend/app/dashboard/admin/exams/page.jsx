"use client";
import { useEffect, useState } from "react";
import ExamTable from "@/components/admin/ExamTable";
import ExamForm from "@/components/admin/ExamForm";
import PublishResultModal from "@/components/admin/PublishResultModal";
import { examService } from "@/services/examService";

export default function AdminExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [publishingExam, setPublishingExam] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await examService.list({ limit: 100 });
      setExams(response.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    examService.list({ limit: 100 })
      .then((response) => {
        if (active) setExams(response.data || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load exams.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleCreateOrEdit = async (payload) => {
    if (editingExam?._id) await examService.update(editingExam._id, payload);
    else await examService.create(payload);
    await load();
  };

  const handleDelete = async (exam) => {
    if (!confirm(`Delete "${exam.subject}" exam? This cannot be undone.`)) return;
    try {
      await examService.remove(exam._id);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the exam.");
    }
  };

  const handlePublishResult = async (id, payload) => {
    await examService.publishResult(id, payload);
    await load();
  };

  const openCreate = () => {
    setEditingExam(null);
    setFormOpen(true);
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setFormOpen(true);
  };

  return (
    <main className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Exams &amp; Results</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule exams and publish results for your school.</p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 rounded-xl bg-brand-blue text-white font-semibold px-5 py-2.5 text-sm hover:bg-blue-600 transition"
        >
          + Schedule Exam
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">Loading…</div>
      ) : (
        <ExamTable
          exams={exams}
          onEdit={openEdit}
          onDelete={handleDelete}
          onPublishResult={setPublishingExam}
        />
      )}

      {formOpen && (
        <ExamForm
          initial={editingExam}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreateOrEdit}
        />
      )}

      {publishingExam && (
        <PublishResultModal
          exam={publishingExam}
          onClose={() => setPublishingExam(null)}
          onSubmit={handlePublishResult}
        />
      )}
    </main>
  );
}
