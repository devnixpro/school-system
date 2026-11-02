"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import InvoiceTable from "@/components/admin/InvoiceTable";

const money = (n) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0,
}).format(Number(n) || 0);

function statusOf(fee) {
  const status = String(fee.status || "pending").toLowerCase();
  if (status === "paid") return "paid";
  if (status === "overdue") return "overdue";
  if (fee.dueDate && new Date(fee.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) return "overdue";
  return "pending";
}

export default function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/fees");
      if (!response.ok) throw new Error("Could not load your fees. Please retry.");
      const data = await response.json();
      setFees(Array.isArray(data) ? data : data.fees || data.invoices || []);
    } catch (err) {
      setError(err.message || "Unable to load fee records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const pending = fees.filter((fee) => statusOf(fee) !== "paid");
  const paid = fees.filter((fee) => statusOf(fee) === "paid");
  const outstanding = pending.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const collected = paid.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

  const trend = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        month: date.toLocaleDateString("en-US", { month: "short" }),
        paid: 0,
        due: 0,
      };
    });
    const index = new Map(months.map((item, i) => [item.key, i]));

    fees.forEach((fee) => {
      const raw = fee.paidAt || fee.paymentDate || fee.dueDate || fee.createdAt;
      if (!raw) return;
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return;
      const i = index.get(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
      if (i === undefined) return;
      if (statusOf(fee) === "paid") months[i].paid += Number(fee.amount) || 0;
      else months[i].due += Number(fee.amount) || 0;
    });
    return months;
  }, [fees]);

  async function payInvoice(fee) {
    const id = fee._id || fee.id;
    if (!id) throw new Error("Invoice ID is missing.");
    const response = await fetch(`/api/fees/${encodeURIComponent(id)}/pay`, { method: "PUT" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || data.error || "Payment status could not be updated.");
    }
    setNotice("Invoice payment status updated.");
    await load();
  }

  async function payNow() {
    if (!pending.length) return;
    if (pending.length > 1) {
      setNotice("Select Pay on the individual invoice you want to record.");
      return;
    }
    setPaying(true);
    setError("");
    try {
      await payInvoice(pending[0]);
    } catch (err) {
      setError(err.message || "Unable to update payment.");
    } finally {
      setPaying(false);
    }
  }

  async function receipt(fee) {
    const id = fee._id || fee.id;
    if (!id) throw new Error("Invoice ID is missing.");
    const response = await fetch(`/api/fees/${encodeURIComponent(id)}/receipt`);
    if (!response.ok) throw new Error("Unable to download this receipt.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `receipt-${id}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-7">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">STUDENT PORTAL / FINANCE</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">My fee account</h1>
            <p className="mt-2 text-sm text-gray-500">Your dues, payment history, and downloadable receipts in one place.</p>
          </div>
          <button onClick={load} disabled={loading} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50">{loading ? "Refreshing..." : "↻ Refresh"}</button>
        </header>

        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>{error}</span><button onClick={load} className="font-bold underline">Try again</button></div>}
        {notice && <div role="status" className="flex justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}<button onClick={() => setNotice("")}>Dismiss ×</button></div>}

        <section className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-xl shadow-blue-500/15 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border-[44px] border-white/10" />
          <div className="pointer-events-none absolute bottom-[-90px] right-52 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">₨</span> TOTAL PENDING DUES</div>
              <p className="mt-5 break-words text-4xl font-bold tracking-tight sm:text-5xl">{loading ? "Loading..." : money(outstanding)}</p>
              <p className="mt-3 text-sm text-white/75">{loading ? "Checking your account" : `${pending.length} outstanding invoice${pending.length === 1 ? "" : "s"} · ${paid.length} paid`}</p>
              <div className="mt-6 h-2 max-w-md overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${fees.length ? paid.length / fees.length * 100 : 0}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/70">{fees.length ? Math.round(paid.length / fees.length * 100) : 0}% of invoices paid</p>
            </div>
            <button onClick={payNow} disabled={loading || paying || pending.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-brand shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">
              {paying ? "Processing..." : pending.length ? "Pay Now →" : "All dues cleared ✓"}
            </button>
          </div>
          <p className="relative mt-5 text-xs leading-5 text-white/65">This action updates the invoice status through your backend. A payment gateway is required to collect money online.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Outstanding balance", value: outstanding, caption: `${pending.length} unpaid invoices`, style: "bg-amber-50 text-amber-700", icon: "◷" },
            { label: "Total paid", value: collected, caption: `${paid.length} settled invoices`, style: "bg-emerald-50 text-emerald-700", icon: "✓" },
            { label: "Total invoices", value: fees.length, caption: "All billing periods", style: "bg-blue-50 text-brand", icon: "#" },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${item.style}`}>{item.icon}</span>
              </div>
              <p className="mt-4 text-2xl font-bold text-navy">{loading ? "—" : item.label === "Total invoices" ? item.value : money(item.value)}</p>
              <p className="mt-2 text-xs text-gray-500">{item.caption}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-bold text-navy">Fee activity</h2>
            <p className="mt-1 text-sm text-gray-500">Paid and outstanding invoice amounts by month.</p>
          </div>
          {loading ? <div className="mt-5 h-64 animate-pulse rounded-xl bg-gray-50" /> : (
            <div className="mt-5 h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} barGap={5} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat("en", { notation: "compact" }).format(value)} tickLine={false} axisLine={false} width={48} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <Tooltip formatter={(value) => [money(value), "Amount"]} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="paid" name="Paid" fill="#0077F5" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="due" name="Outstanding" fill="#F59E0B" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-brand" />Paid</span><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />Outstanding</span></div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-navy">Invoice history</h2>
            <p className="mt-1 text-sm text-gray-500">View individual fee records and download receipts.</p>
          </div>
          <InvoiceTable fees={fees} loading={loading} error={error} onRetry={load} onPay={payInvoice} onViewReceipt={receipt} showStudent={false} />
        </section>
      </div>
    </main>
  );
}