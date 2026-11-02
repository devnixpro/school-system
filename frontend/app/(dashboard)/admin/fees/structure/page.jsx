"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const money = (n) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0,
}).format(Number(n) || 0);

export default function GenerateInvoicesPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      try {
        const response = await fetch("/api/students");
        if (!response.ok) throw new Error("Unable to load students from /api/students.");
        const data = await response.json();
        const items = Array.isArray(data) ? data : data.students || data.data || [];
        if (active) setStudents(items);
      } catch (err) {
        if (active) setError(err.message || "Could not load students.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudents();
    return () => { active = false; };
  }, []);

  const getId = (student) => student._id || student.id;
  const getName = (student) => student.name || student.fullName ||
    [student.firstName, student.lastName].filter(Boolean).join(" ") || "Unnamed student";

  const visibleStudents = useMemo(() => students.filter((student) => {
    const search = studentSearch.toLowerCase();
    return `${getName(student)} ${student.rollNumber || student.rollNo || ""}`.toLowerCase().includes(search);
  }), [students, studentSearch]);

  const total = selected.length * (Number(amount) || 0);
  const validAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;

  function toggle(id) {
    setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selected.length) return setError("Select at least one student.");
    if (!validAmount) return setError("Enter a valid fee amount greater than zero.");
    if (!month || !dueDate) return setError("Select the billing month and due date.");

    setSubmitting(true);
    try {
      const response = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: selected,
          amount: Number(amount),
          month,
          dueDate,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || data.error || "Invoice generation failed.");

      setSuccess("Invoices generated successfully. Redirecting to the invoice register...");
      window.setTimeout(() => router.push("/admin/fees/invoices"), 1000);
    } catch (err) {
      setError(err.message || "Unable to generate invoices.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <Link href="/admin/fees/invoices" className="text-sm font-semibold text-brand hover:underline">← Back to invoices</Link>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand">BILLING WORKSPACE</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Generate invoices</h1>
              <p className="mt-2 text-sm text-gray-500">Create a billing batch for selected students.</p>
            </div>
            <span className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-500 shadow-sm">Step 1 of 1 · Invoice setup</span>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        {success && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>}

        <form onSubmit={submit} className="grid items-start gap-6 xl:grid-cols-[1.55fr_0.8fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-bold text-navy">1. Choose students</h2>
                  <p className="mt-1 text-sm text-gray-500">Select the students receiving this fee invoice.</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-brand">{selected.length} selected</span>
              </div>
              <div className="space-y-4 p-4 sm:p-6">
                <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} type="search" placeholder="Search by student name or roll number..." className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => setSelected(visibleStudents.map(getId).filter(Boolean))} className="text-xs font-bold text-brand hover:underline">Select visible</button>
                  <button type="button" onClick={() => setSelected([])} className="text-xs font-semibold text-gray-500 hover:underline">Clear selection</button>
                </div>

                <div className="max-h-[440px] overflow-y-auto rounded-xl border border-gray-100">
                  {loading ? (
                    <div className="space-y-3 p-4">{[1, 2, 3, 4].map((n) => <div key={n} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div>
                  ) : visibleStudents.length === 0 ? (
                    <div className="p-10 text-center text-sm text-gray-500">{students.length ? "No students match your search." : "No students found. Check the /api/students endpoint."}</div>
                  ) : visibleStudents.map((student) => {
                    const id = getId(student);
                    const name = getName(student);
                    const checked = selected.includes(id);
                    return (
                      <label key={id} className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3.5 last:border-0 transition ${checked ? "bg-blue-50/70" : "hover:bg-gray-50"}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggle(id)} className="h-4 w-4 rounded accent-blue-600" />
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${checked ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}>{name.charAt(0).toUpperCase()}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-navy">{name}</span>
                          <span className="mt-1 block text-xs text-gray-500">{student.rollNumber || student.rollNo || student.registrationNumber || "No roll number"}</span>
                        </span>
                        {checked && <span className="text-xs font-bold text-brand">Selected ✓</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-navy">2. Billing details</h2>
              <p className="mt-1 text-sm text-gray-500">Set the billing period, amount, and deadline.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-navy">Fee amount (PKR) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">₨</span>
                    <input id="amount" type="number" min="1" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="15000" className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <div>
                  <label htmlFor="month" className="mb-2 block text-sm font-semibold text-navy">Billing month *</label>
                  <input id="month" type="month" required value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="dueDate" className="mb-2 block text-sm font-semibold text-navy">Payment due date *</label>
                  <input id="dueDate" type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 sm:max-w-sm" />
                  <p className="mt-2 text-xs text-gray-400">The backend should validate the due date and billing period.</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="xl:sticky xl:top-6">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-navy px-5 py-5 text-white">
                <p className="text-sm font-medium text-white/70">Invoice batch summary</p>
                <p className="mt-2 text-3xl font-bold">{money(total)}</p>
                <p className="mt-1 text-xs text-white/60">Estimated total invoice value</p>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex justify-between gap-3 text-sm"><span className="text-gray-500">Selected students</span><span className="font-bold text-navy">{selected.length}</span></div>
                <div className="flex justify-between gap-3 text-sm"><span className="text-gray-500">Amount per invoice</span><span className="font-semibold text-navy">{money(amount)}</span></div>
                <div className="flex justify-between gap-3 text-sm"><span className="text-gray-500">Billing month</span><span className="font-semibold text-navy">{month || "Not selected"}</span></div>
                <div className="flex justify-between gap-3 text-sm"><span className="text-gray-500">Due date</span><span className="font-semibold text-navy">{dueDate || "Not selected"}</span></div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs leading-5 text-gray-500">Review the selection carefully. Your backend should enforce duplicate-invoice rules and authorization.</p>
                </div>
                <button type="submit" disabled={submitting || loading || students.length === 0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Generating batch...</> : "Generate invoices →"}
                </button>
                <Link href="/admin/fees/invoices" className="block py-1 text-center text-sm font-semibold text-gray-500 hover:text-navy">Cancel and return</Link>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}