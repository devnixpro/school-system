"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell,
} from "recharts";
import api from "@/services/api";
import { exportToCsv } from "@/utils/exportToCsv";

const currency = (value) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", notation: "compact", maximumFractionDigits: 1,
}).format(Number(value) || 0);

const fullCurrency = (value) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0,
}).format(Number(value) || 0);

const COLORS = ["#0077F5", "#10B981", "#F59E0B", "#94A3B8"];
const VIEWS = [
  { value: "table", label: "Table" },
  { value: "grouped", label: "Grouped" },
];

function paymentMethod(fee) {
  const value = String(fee.paymentMethod || fee.method || "").toLowerCase();
  if (value.includes("cash")) return "Cash";
  if (["online", "bank", "card", "digital", "easypaisa", "jazzcash"].some((x) => value.includes(x))) return "Online";
  return "Unclassified";
}

function formatMonth(fee) {
  if (fee.month) return fee.month;
  const rawDate = fee.paidAt || fee.paymentDate || fee.paidDate || fee.updatedAt;
  const date = rawDate ? new Date(rawDate) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-PK", { month: "long", year: "numeric" })
    : "Unknown";
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

async function fetchPaidFees() {
  const response = await api.get("/fees", { params: { status: "paid", limit: 200 } });
  const items = response.data?.data;
  if (!Array.isArray(items)) {
    throw new Error("The payments response has an unexpected format.");
  }
  return items.filter((fee) => String(fee.status || "").toLowerCase() === "paid");
}

export default function AdminPaymentsPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");
  const [methodFilter, setMethodFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");
  const [receiptError, setReceiptError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setFees(await fetchPaidFees());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load payment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchPaidFees()
      .then((items) => {
        if (active) setFees(items);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || err.message || "Unable to load payment data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const total = fees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const cashFees = fees.filter((fee) => paymentMethod(fee) === "Cash");
  const onlineFees = fees.filter((fee) => paymentMethod(fee) === "Online");
  const cashTotal = cashFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const onlineTotal = onlineFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const unknownTotal = total - cashTotal - onlineTotal;

  const trend = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      return {
        key: monthKey(date),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        collected: 0,
      };
    });
    const indexByMonth = new Map(months.map((item, index) => [item.key, index]));

    fees.forEach((fee) => {
      const rawDate = fee.paidAt || fee.paymentDate || fee.updatedAt;
      if (!rawDate) return;
      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;
      const index = indexByMonth.get(monthKey(date));
      if (index !== undefined) months[index].collected += Number(fee.amount) || 0;
    });

    return months;
  }, [fees]);

  const methods = [
    { name: "Cash", value: cashTotal },
    { name: "Online", value: onlineTotal },
    { name: "Unclassified", value: Math.max(0, unknownTotal) },
  ].filter((item) => item.value > 0);

  const filtered = useMemo(() => fees.filter((fee) => {
    const student = fee.student?.name || fee.studentName || "Student";
    const invoice = fee.invoiceNumber || fee.invoiceNo || fee._id || fee.id || "";
    const matchesSearch = `${student} ${invoice} ${paymentMethod(fee)}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesMethod = methodFilter === "all" ||
      paymentMethod(fee).toLowerCase() === methodFilter;
    const matchesMonth = !monthFilter ||
      formatMonth(fee).toLowerCase().includes(monthFilter.trim().toLowerCase());
    return matchesSearch && matchesMethod && matchesMonth;
  }), [fees, search, methodFilter, monthFilter]);

  const groupedByMonth = useMemo(() => {
    const groups = new Map();
    filtered.forEach((fee) => {
      const month = formatMonth(fee);
      if (!groups.has(month)) groups.set(month, []);
      groups.get(month).push(fee);
    });
    return [...groups.entries()].sort(([first], [second]) => second.localeCompare(first));
  }, [filtered]);

  const handleExport = () => {
    exportToCsv("payment-history", filtered, [
      { label: "Invoice", value: (fee) => fee.invoiceNumber || fee.invoiceNo || fee._id || fee.id },
      { label: "Student", value: (fee) => fee.student?.name || fee.studentName || "" },
      { label: "Amount", value: (fee) => fee.amount },
      { label: "Month", value: formatMonth },
      { label: "Paid date", value: (fee) => fee.paidAt || fee.paymentDate || fee.paidDate || fee.updatedAt || "" },
      { label: "Method", value: paymentMethod },
    ]);
  };

  const handleReceipt = async (fee) => {
    setReceiptError("");
    try {
      const id = fee._id || fee.id;
      if (!id) throw new Error("Invoice ID is missing.");
      const response = await api.get(`/fees/${encodeURIComponent(id)}/receipt`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `receipt-${id}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setReceiptError(requestError.response?.data?.message || requestError.message || "Unable to download the receipt.");
    }
  };

  const cards = [
    { title: "Total collected", value: total, hint: `${fees.length} recorded payments`, icon: "↗", color: "bg-blue-50 text-brand" },
    { title: "Cash collections", value: cashTotal, hint: `${cashFees.length} cash transactions`, icon: "₨", color: "bg-emerald-50 text-emerald-700" },
    { title: "Online collections", value: onlineTotal, hint: `${onlineFees.length} digital transactions`, icon: "⇧", color: "bg-violet-50 text-violet-700" },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">FINANCE / COLLECTIONS</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Payment analytics</h1>
            <p className="mt-2 text-sm text-gray-500">Monitor collection performance and review recorded transactions.</p>
          </div>
          <button onClick={load} disabled={loading} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50">
            {loading ? "Refreshing..." : "↻ Refresh data"}
          </button>
        </header>

        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>{error}</span><button onClick={load} className="font-bold underline">Retry</button></div>}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-3 break-words text-2xl font-bold tracking-tight text-navy sm:text-3xl">{loading ? "—" : fullCurrency(card.value)}</p>
                  <p className="mt-2 text-xs text-gray-500">{card.hint}</p>
                </div>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${card.color}`}>{card.icon}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-navy">Collection trend</h2>
                <p className="mt-1 text-sm text-gray-500">Monthly recorded payments for the last six months</p>
              </div>
              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand">PKR</span>
            </div>
            {loading ? <div className="mt-6 h-72 animate-pulse rounded-xl bg-gray-50" /> : (
              <div className="mt-6 h-72 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="collectionFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0077F5" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="#0077F5" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#EEF2F7" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => currency(value)} tickLine={false} axisLine={false} width={65} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <Tooltip formatter={(value) => [fullCurrency(value), "Collected"]} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 8px 24px #0f172a0d" }} />
                    <Area type="monotone" dataKey="collected" stroke="#0077F5" strokeWidth={3} fill="url(#collectionFill)" activeDot={{ r: 5, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="mt-2 text-xs leading-5 text-gray-400">Trend uses paid invoices with a valid paidAt, paymentDate, or updatedAt date. Missing dates cannot be assigned to a month.</p>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-navy">Payment composition</h2>
            <p className="mt-1 text-sm text-gray-500">Breakdown by recorded payment method</p>
            {loading ? <div className="mt-6 h-64 animate-pulse rounded-xl bg-gray-50" /> : (
              <>
                <div className="relative mt-4 h-56 min-w-0">
                  {methods.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={methods} dataKey="value" nameKey="name" innerRadius={60} outerRadius={88} paddingAngle={4} stroke="none">
                          {methods.map((item) => <Cell key={item.name} fill={item.name === "Cash" ? "#10B981" : item.name === "Online" ? "#0077F5" : "#94A3B8"} />)}
                        </Pie>
                        <Tooltip formatter={(value) => [fullCurrency(value), "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 text-center text-sm text-gray-500">No payment method data yet</div>
                  )}
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Cash", value: cashTotal, color: "#10B981" },
                    { name: "Online", value: onlineTotal, color: "#0077F5" },
                    { name: "Unclassified", value: Math.max(0, unknownTotal), color: "#94A3B8" },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-gray-600"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.name}</span>
                        <span className="font-semibold text-navy">{fullCurrency(item.value)}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full" style={{ width: `${total ? item.value / total * 100 : 0}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-navy">Recent payments</h2>
              <p className="mt-1 text-sm text-gray-500">Recorded paid invoices from your fee records.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or invoice..." className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 sm:w-auto" />
              <input type="text" value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} placeholder="Filter by month" className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 sm:w-40" />
              <select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700">
                <option value="all">All methods</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="unclassified">Unclassified</option>
              </select>
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
                {VIEWS.map((option) => (
                  <button key={option.value} type="button" onClick={() => setView(option.value)} aria-pressed={view === option.value} className={`rounded-lg px-3 py-2 text-sm font-medium ${view === option.value ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                    {option.label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleExport} disabled={!filtered.length} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40">
                Export CSV
              </button>
            </div>
          </div>

          {receiptError && <p role="alert" className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">{receiptError}</p>}

          {loading ? <div className="space-y-3 p-6">{[1, 2, 3, 4].map((n) => <div key={n} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div> : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-500">₨</div>
              <h3 className="mt-3 font-bold text-navy">No matching payments</h3>
              <p className="mt-1 text-sm text-gray-500">Recorded payments will appear here after invoices are marked paid.</p>
            </div>
          ) : view === "grouped" ? (
            <div className="space-y-5 p-4 sm:p-6">
              {groupedByMonth.map(([month, items]) => (
                <section key={month} className="overflow-hidden rounded-xl border border-gray-100">
                  <header className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 px-4 py-3">
                    <h3 className="font-semibold text-navy">{month}</h3>
                    <span className="text-sm text-gray-500">
                      {items.length} payment{items.length === 1 ? "" : "s"} · {fullCurrency(items.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0))}
                    </span>
                  </header>
                  <ul className="divide-y divide-gray-100">
                    {items.map((fee) => {
                      const id = fee._id || fee.id;
                      const student = fee.student?.name || fee.studentName || "Student";
                      const invoice = fee.invoiceNumber || fee.invoiceNo || `INV-${id}`;
                      return (
                        <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-navy">{student}</p>
                            <p className="mt-1 text-xs text-gray-500">{invoice} · {paymentMethod(fee)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold tabular-nums text-navy">{fullCurrency(fee.amount)}</span>
                            <button type="button" onClick={() => handleReceipt(fee)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Receipt</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                  <tr><th className="px-6 py-4">Student / invoice</th><th className="px-6 py-4">Payment date</th><th className="px-6 py-4">Method</th><th className="px-6 py-4 text-right">Amount</th><th className="px-6 py-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((fee) => {
                    const id = fee._id || fee.id;
                    const date = fee.paidAt || fee.paymentDate || fee.updatedAt;
                    const student = fee.student?.name || fee.studentName || "Student";
                    return (
                      <tr key={id} className="hover:bg-gray-50/70">
                        <td className="px-6 py-4"><p className="font-semibold text-navy">{student}</p><p className="mt-1 text-xs text-gray-400">{fee.invoiceNumber || fee.invoiceNo || `INV-${id}`}</p></td>
                        <td className="px-6 py-4 text-gray-600">{date && !Number.isNaN(new Date(date).getTime()) ? new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "Date unavailable"}</td>
                        <td className="px-6 py-4"><span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700">{paymentMethod(fee)}</span></td>
                        <td className="px-6 py-4 text-right font-bold tabular-nums text-navy">{fullCurrency(fee.amount)}</td>
                        <td className="px-6 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Paid</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}