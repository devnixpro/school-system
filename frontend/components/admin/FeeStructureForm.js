"use client";

import { useMemo, useState } from "react";
import { validateFeeForm } from "@/utils/feeValidators";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

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
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q)
    );
  }, [students, query]);

  const total = form.studentIds.length * Number(form.amount || 0);

  const toggle = (id) =>
    setForm((p) => ({
      ...p,
      studentIds: p.studentIds.includes(id)
        ? p.studentIds.filter((s) => s !== id)
        : [...p.studentIds, id],
    }));

  const selectAllVisible = () => {
    const ids = filtered.map((s) => s._id);
    const all = ids.every((id) => form.studentIds.includes(id));
    setForm((p) => ({
      ...p,
      studentIds: all
        ? p.studentIds.filter((id) => !ids.includes(id))
        : Array.from(new Set([...p.studentIds, ...ids])),
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
    errors[key] ? (
      <p role="alert" className="text-xs text-red-600 mt-1.5">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-navy">
            Students
            <span className="ml-2 text-xs font-normal text-gray-500">
              {form.studentIds.length} selected
            </span>
          </label>
          {filtered.length > 0 && (
            <button
              type="button"
              onClick={selectAllVisible}
              className="text-xs font-medium text-gray-600 hover:text-navy focus:outline-none focus-visible:underline transition"
            >
              {filtered.every((s) => form.studentIds.includes(s._id))
                ? "Deselect all"
                : "Select all"}
            </button>
          )}
        </div>

        <input
          type="search"
          placeholder="Search students by name or roll number"
          aria-label="Search students"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-3 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 transition"
        />

        <div
          className={`max-h-64 overflow-y-auto rounded-lg border divide-y divide-gray-100 ${
            errors.studentIds ? "border-red-300" : "border-gray-200"
          }`}
        >
          {loading && (
            <p className="p-4 text-sm text-gray-400">Loading students</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-400">
              {students.length === 0
                ? "No students available yet."
                : "No students match your search."}
            </p>
          )}
          {!loading &&
            filtered.map((s) => {
              const checked = form.studentIds.includes(s._id);
              return (
                <label
                  key={s._id}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition ${
                    checked ? "bg-gray-50" : "hover:bg-gray-50/60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(s._id)}
                    className="rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy truncate">
                      {s.name}
                    </div>
                    {s.rollNo && (
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {s.rollNo}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
        </div>
        {fieldError("studentIds")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="fee-amount"
            className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Amount (PKR)
          </label>
          <input
            id="fee-amount"
            type="number"
            min="0"
            placeholder="5000"
            value={form.amount}
            onChange={set("amount")}
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none transition ${
              errors.amount
                ? "border-red-300"
                : "border-gray-200 focus:border-gray-400"
            } focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1`}
          />
          {fieldError("amount")}
        </div>
        <div>
          <label
            htmlFor="fee-month"
            className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Month
          </label>
          <input
            id="fee-month"
            type="text"
            value={form.month}
            onChange={set("month")}
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none transition ${
              errors.month
                ? "border-red-300"
                : "border-gray-200 focus:border-gray-400"
            } focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1`}
          />
          {fieldError("month")}
        </div>
        <div>
          <label
            htmlFor="fee-due"
            className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Due date
          </label>
          <input
            id="fee-due"
            type="date"
            value={form.dueDate}
            onChange={set("dueDate")}
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none transition ${
              errors.dueDate
                ? "border-red-300"
                : "border-gray-200 focus:border-gray-400"
            } focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1`}
          />
          {fieldError("dueDate")}
        </div>
      </div>

      {form.studentIds.length > 0 && form.amount && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {form.studentIds.length} invoice
            {form.studentIds.length !== 1 ? "s" : ""}  PKR{" "}
            {Number(form.amount).toLocaleString()}
          </span>
          <span className="font-semibold text-navy tabular-nums">
            PKR {total.toLocaleString()}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 bg-navy text-white hover:bg-navy-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition"
      >
        {submitting
          ? "Generating invoices"
          : `Generate ${form.studentIds.length || 0} invoice${
              form.studentIds.length !== 1 ? "s" : ""
            }`}
      </button>
    </form>
  );
}