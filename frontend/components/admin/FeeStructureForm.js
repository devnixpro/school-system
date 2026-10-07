"use client";

import { useMemo, useState } from "react";
import { validateFeeForm } from "@/utils/feeValidators";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function FeeStructureForm({ onSubmit, students = [], loading = false }) {
  const now = new Date();
  const [form, setForm] = useState({
    studentIds: [],
    amount: "",
    month: `${MONTHS[now.getMonth()]}-${now.getFullYear()}`,
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) => s.name?.toLowerCase().includes(q) || s.rollNo?.toLowerCase().includes(q)
    );
  }, [students, query]);

  const total = form.studentIds.length * Number(form.amount || 0);

  const toggle = (id) =>
    setForm((p) => ({
      ...p,
      studentIds: p.studentIds.includes(id) ? p.studentIds.filter((s) => s !== id) : [...p.studentIds, id],
    }));

  const selectAllVisible = () => {
    const ids = filtered.map((s) => s._id);
    const all = ids.every((id) => form.studentIds.includes(id));
    setForm((p) => ({
      ...p,
      studentIds: all ? p.studentIds.filter((id) => !ids.includes(id)) : Array.from(new Set([...p.studentIds, ...ids])),
    }));
  };

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateFeeForm(form);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit?.({ ...form, amount: parseFloat(form.amount) });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (key) =>
    errors[key] ? <p className="text-xs text-red-600 mt-1">{errors[key]}</p> : null;

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">
            Students <span className="ml-2 text-xs font-normal text-gray-500">{form.studentIds.length} selected</span>
          </label>
          {filtered.length > 0 && (
            <button type="button" onClick={selectAllVisible} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              {filtered.every((s) => form.studentIds.includes(s._id)) ? "Deselect all" : "Select all"}
            </button>
          )}
        </div>

        <input
          type="search"
          placeholder="Search by name or roll no…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
        />

        <div className={`max-h-64 overflow-y-auto rounded-xl border divide-y divide-gray-100 ${errors.studentIds ? "border-red-300" : "border-gray-200"}`}>
          {loading && <p className="p-4 text-sm text-gray-400">Loading students…</p>}
          {!loading && filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-400">
              {students.length === 0 ? "No students yet." : "No students match your search."}
            </p>
          )}
          {!loading && filtered.map((s) => {
            const checked = form.studentIds.includes(s._id);
            return (
              <label key={s._id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition ${checked ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(s._id)} className="rounded" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{s.name}</div>
                  {s.rollNo && <div className="text-[11px] text-gray-400">{s.rollNo}</div>}
                </div>
              </label>
            );
          })}
        </div>
        {fieldError("studentIds")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Amount (PKR)</label>
          <input
            type="number"
            min="0"
            placeholder="5000"
            value={form.amount}
            onChange={set("amount")}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.amount ? "border-red-300" : "border-gray-200"}`}
          />
          {fieldError("amount")}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Month</label>
          <input
            type="text"
            value={form.month}
            onChange={set("month")}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.month ? "border-red-300" : "border-gray-200"}`}
          />
          {fieldError("month")}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Due date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={set("dueDate")}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.dueDate ? "border-red-300" : "border-gray-200"}`}
          />
          {fieldError("dueDate")}
        </div>
      </div>

      {form.studentIds.length > 0 && form.amount && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {form.studentIds.length} invoice{form.studentIds.length !== 1 ? "s" : ""} × PKR {Number(form.amount).toLocaleString()}
          </span>
          <span className="font-bold text-lg text-blue-900">PKR {total.toLocaleString()}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Generating…" : `Generate ${form.studentIds.length || 0} Invoice${form.studentIds.length !== 1 ? "s" : ""}`}
      </button>
    </form>
  );
}