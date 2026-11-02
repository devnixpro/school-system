"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Edit3, X, Loader2, CalendarDays, AlertCircle } from "lucide-react";
import api from "@/services/api";

const EMPTY_FORM = {
  title: "",
  description: "",
  className: "",
  section: "",
  subject: "",
  dueDate: "",
};

export default function HomeworkPage() {
  const [homeworks, setHomeworks] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchHomework = useCallback(async () => {
      const { data } = await api.get("/homework", {
        params: classFilter ? { className: classFilter } : {},
      });
      return data.data || [];
  }, [classFilter]);

  const loadHomework = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setHomeworks(await fetchHomework());
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load homework.");
    } finally {
      setLoading(false);
    }
  }, [fetchHomework]);

  useEffect(() => {
    let active = true;
    fetchHomework()
      .then((items) => {
        if (active) setHomeworks(items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load homework.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [fetchHomework]);

  const openForm = (homework) => {
    setError("");
    setSuccess("");
    setEditingId(homework?._id || "");
    setForm(homework ? {
      title: homework.title || "",
      description: homework.description || "",
      className: homework.className || "",
      section: homework.section || "",
      subject: homework.subject || "",
      dueDate: homework.dueDate ? new Date(homework.dueDate).toISOString().slice(0, 10) : "",
    } : { ...EMPTY_FORM, className: classFilter });
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditingId("");
    setForm(EMPTY_FORM);
  };

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/homework/${editingId}`, form);
        setSuccess("Homework updated.");
      } else {
        await api.post("/homework", form);
        setSuccess("Homework published.");
      }
      closeForm();
      await loadHomework();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save homework.");
    } finally {
      setSaving(false);
    }
  };

  const deleteHomework = async (homework) => {
    if (!window.confirm(`Delete "${homework.title}"?`)) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/homework/${homework._id}`);
      setSuccess("Homework deleted.");
      await loadHomework();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete homework.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homework &amp; Assignments</h1>
          <p className="mt-1 text-sm text-slate-500">Publish assignments for a class and section.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            placeholder="Filter by class"
            aria-label="Filter by class"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
          <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Create homework
          </button>
        </div>
      </header>

      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle className="h-4 w-4" />{error}</div>}
      {success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">Loading homework...</div>
      ) : homeworks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          <p className="font-semibold text-slate-800">No homework found</p>
          <p className="mt-1 text-sm">Create an assignment to make it visible to linked parents.</p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {homeworks.map((homework) => (
            <article key={homework._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">{homework.subject}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{homework.title}</h2>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openForm(homework)} aria-label={`Edit ${homework.title}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => deleteHomework(homework)} aria-label={`Delete ${homework.title}`} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{homework.description || "No additional instructions."}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>{[homework.className, homework.section && `Section ${homework.section}`].filter(Boolean).join(" · ")}</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Due {new Date(homework.dueDate).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </section>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="homework-dialog-title" className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <header className="mb-5 flex items-center justify-between">
              <h2 id="homework-dialog-title" className="text-lg font-bold text-slate-900">{editingId ? "Edit homework" : "Create homework"}</h2>
              <button onClick={closeForm} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </header>
            <form onSubmit={submitForm} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Title
                <input name="title" value={form.title} onChange={updateForm} required maxLength={160} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">Subject
                  <input name="subject" value={form.subject} onChange={updateForm} required maxLength={100} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium text-slate-700">Due date
                  <input name="dueDate" type="date" value={form.dueDate} onChange={updateForm} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium text-slate-700">Class
                  <input name="className" value={form.className} onChange={updateForm} required placeholder="Match the student class" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                </label>
                <label className="block text-sm font-medium text-slate-700">Section (optional)
                  <input name="section" value={form.section} onChange={updateForm} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">Instructions
                <textarea name="description" value={form.description} onChange={updateForm} rows={4} maxLength={5000} className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2" />
              </label>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={closeForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : editingId ? "Save changes" : "Publish homework"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
