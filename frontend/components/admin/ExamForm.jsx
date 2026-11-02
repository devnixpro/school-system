"use client";
import { useState } from "react";

const EMPTY = {
  subject: "",
  examType: "Midterm",
  className: "",
  date: "",
  startTime: "",
  duration: 60,
  totalMarks: 100,
};

export default function ExamForm({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?._id);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-brand-navy text-lg">{isEdit ? "Edit Exam" : "Schedule New Exam"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600">Subject</label>
              <input required value={form.subject} onChange={set("subject")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Exam Type</label>
              <select value={form.examType} onChange={set("examType")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue">
                {["Quiz", "Midterm", "Final", "Test"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Class</label>
              <input required value={form.className} onChange={set("className")} placeholder="Grade 9 - A"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Date</label>
              <input required type="date" value={form.date} onChange={set("date")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Start Time</label>
              <input required type="time" value={form.startTime} onChange={set("startTime")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Duration (min)</label>
              <input required type="number" min="10" value={form.duration} onChange={set("duration")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Total Marks</label>
              <input required type="number" min="1" value={form.totalMarks} onChange={set("totalMarks")}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl bg-brand-blue text-white py-2.5 text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-60">
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Schedule Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
