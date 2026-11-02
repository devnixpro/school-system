"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
import InvoiceTable from "@/components/admin/InvoiceTable";

const COLORS = ["#10B981", "#F59E0B", "#F43F5E"];
const currency = (n) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0,
}).format(n || 0);

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  return response;
}

function getStatus(fee) {
  const status = String(fee.status || "pending").toLowerCase();
  if (status === "paid") return "paid";
  if (status === "overdue") return "overdue";
  if (fee.dueDate && new Date(fee.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) return "overdue";
  return "pending";
}

export default function AdminInvoicesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const loadFees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api("/api/fees");
      const data = await response.json();
      setFees(Array.isArray(data) ? data : data.fees || data.invoices || []);
    } catch (err) {
      setError(err.message || "Could not load invoices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFees(); }, [loadFees]);

  const counts = useMemo(() => {
    const result = { all: fees.length, paid: 0, pending: 0, overdue: 0 };
    fees.forEach((fee) => result[getStatus(fee)]++);
    return result;
  }, [fees]);

  const chartData = [
    { name: "Paid", value: counts.paid },
    { name: "Pending", value: counts.pending },
    { name: "Overdue", value: counts.overdue },
  ];

  const totalBilled = fees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const collected = fees.filter((fee) => getStatus(fee) === "paid")
    .reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const outstanding = fees.filter((fee) => getStatus(fee) !== "paid")
    .reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

  const filtered = fees.filter((fee) => {
    const student = fee.student?.name || fee.studentName || fee.student?.fullName || "";
    const text = [fee.invoiceNumber, fee.invoiceNo, student, fee.rollNumber, fee.month].join(" ").toLowerCase();
    return (filter === "all" || getStatus(fee) === filter) && text.includes(search.toLowerCase());
  });

  async function payInvoice(fee) {
    const id = fee._id || fee.id;
    if (!id) throw new Error("Invoice ID is missing.");
    await api(`/api/fees/${encodeURIComponent(id)}/pay`, { method: "PUT" });
    setNotice("Invoice payment status updated.");
    await loadFees();
  }

  async function deleteInvoice(fee) {
    const id = fee._id || fee.id;
    if (!id) throw new Error("Invoice ID is missing.");
    await api(`/api/fees/${encodeURIComponent(id)}`, { method: "DELETE" });
    setFees((current) => current.filter((item) => (item._id || item.id) !== id));
    setNotice("Invoice deleted.");
  }

  async function receipt(fee) {
    const id = fee._id || fee.id;
    const response = await api(`/api/fees/${encodeURIComponent(id)}/receipt`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `receipt-${id}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { title: "Total billed", value: totalBilled, sub: `${counts.all} invoices`, icon: "↗", tone: "blue" },
    { title: "Collected", value: collected, sub: `${counts.paid} paid invoices`, icon: "✓", tone: "green" },
    { title: "Outstanding", value: outstanding, sub: `${counts.pending + counts.overdue} unpaid invoices`, icon: "◷", tone: "amber" },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">FINANCE / BILLING</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Invoices</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">A complete view of billing, collections, and unpaid student fees.</p>
          </div>
          <Link href="/admin/fees/structure" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:opacity-95">
            <span className="text-lg">+</span> Generate invoice
          </Link>
        </header>

        {notice && <div role="status" className="flex justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}<button onClick={() => setNotice("")}>Dismiss ×</button></div>}

        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>{error}</span><button onClick={loadFees} className="font-bold underline">Try again</button></div>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-3 break-words text-2xl font-bold tracking-tight text-navy">{loading ? "—" : currency(card.value)}</p>
                  <p className="mt-2 text-xs text-gray-500">{card.sub}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${card.tone === "green" ? "bg-emerald-50 text-emerald-600" : card.tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-brand"}`}>{card.icon}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-navy">Invoice status overview</h2>
                <p className="mt-1 text-sm text-gray-500">Distribution of current invoices</p>
              </div>
              <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-500">Live data</span>
            </div>
            {loading ? <div className="mt-5 h-56 animate-pulse rounded-xl bg-gray-50" /> : (
              <div className="grid items-center gap-4 sm:grid-cols-2">
                <div className="relative h-56 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={63} outerRadius={91} paddingAngle={4} stroke="none">
                        {chartData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} invoices`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-navy">{counts.all}</span>
                    <span className="text-xs text-gray-500">Invoices</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-bold tabular-nums text-navy">{item.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">Collection rate</p>
                    <p className="mt-1 text-xl font-bold text-navy">{totalBilled ? Math.round(collected / totalBilled * 100) : 0}%</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-navy">Quick filters</h2>
            <p className="mt-1 text-sm text-gray-500">Focus on the invoices you need.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { key: "all", label: "All invoices", color: "text-navy" },
                { key: "paid", label: "Paid", color: "text-emerald-700" },
                { key: "pending", label: "Pending", color: "text-amber-700" },
                { key: "overdue", label: "Overdue", color: "text-rose-700" },
              ].map((item) => (
                <button key={item.key} onClick={() => setFilter(item.key)} className={`rounded-xl border p-4 text-left transition ${filter === item.key ? "border-brand bg-blue-50 ring-1 ring-brand" : "border-gray-200 hover:bg-gray-50"}`}>
                  <p className={`text-xs font-semibold ${item.color}`}>{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-navy">{loading ? "—" : counts[item.key]}</p>
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-navy">Invoice register</h2>
              <p className="mt-1 text-sm text-gray-500">Search, review, and manage individual invoices.</p>
            </div>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search invoice, student, roll no..." className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100 lg:max-w-sm" />
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {["all", "paid", "pending", "overdue"].map((key) => (
              <button key={key} onClick={() => setFilter(key)} className={`rounded-lg px-3.5 py-2 text-xs font-bold capitalize transition ${filter === key ? "bg-brand text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{key} ({counts[key]})</button>
            ))}
          </div>
          <InvoiceTable fees={filtered} loading={loading} error={error} onRetry={loadFees} onPay={payInvoice} onDelete={deleteInvoice} onViewReceipt={receipt} showStudent />
        </section>
      </div>
    </main>
  );
}