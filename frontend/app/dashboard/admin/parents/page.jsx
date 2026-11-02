"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function CreateParentPage() {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const firstPage = await api.get("/students", {
          params: { limit: 100, page: 1, isActive: true },
        });
        const totalPages = firstPage.data.totalPages || 1;
        const otherPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            api.get("/students", {
              params: { limit: 100, page: index + 2, isActive: true },
            })
          )
        );
        const allStudents = [
          ...(firstPage.data.data || []),
          ...otherPages.flatMap(({ data }) => data.data || []),
        ];
        setStudents(allStudents.filter((student) => !student.parent));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load unlinked students.");
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
  }, []);

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const toggleStudent = (studentId) => {
    setSelectedIds((current) => current.includes(studentId)
      ? current.filter((id) => id !== studentId)
      : [...current, studentId]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedIds.length) {
      setError("Select at least one student to link to this parent account.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/admin/parents", {
        ...form,
        studentIds: selectedIds,
      });
      setSuccess(`Parent account created for ${data.data.email} and linked to ${data.data.studentIds.length} student(s).`);
      setForm({ name: "", email: "", password: "" });
      setSelectedIds([]);
      setStudents((current) => current.filter((student) => !selectedIds.includes(student._id)));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create the parent account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">School administration</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Create parent account</h1>
        <p className="mt-2 text-sm text-slate-600">Create login credentials and link one or more active students in your school.</p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <section className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Parent name
            <input
              name="name"
              value={form.name}
              onChange={updateForm}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateForm}
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Temporary password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateForm}
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">Share this securely with the parent. They can sign in from the regular login page.</span>
          </label>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Link students</h2>
              <p className="mt-1 text-xs text-slate-500">Only active students not already linked to a parent are listed.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{selectedIds.length} selected</span>
          </div>

          {loadingStudents ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">No unlinked active students found.</p>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
              {students.map((student) => (
                <label key={student._id} className="flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(student._id)}
                    onChange={() => toggleStudent(student._id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900">{student.name}</span>
                    <span className="block text-xs text-slate-500">
                      {[student.class, student.section && `Section ${student.section}`, student.rollNumber && `Roll ${student.rollNumber}`].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={submitting || loadingStudents}
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create parent account"}
          </button>
        </div>
      </form>
    </main>
  );
}
