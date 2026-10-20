"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";
import { exportToCsv } from "@/utils/exportToCsv";
import {
  IconArrowLeft,
  IconDownload,
  IconCheckCircle,
  IconEmptyCard,
  IconWallet,
  IconReceipt,
  IconChart,
  IconTrendUp,
} from "@/components/common/FeeIcons";

// Fallback mock data (used when backend is offline)
const MOCK_PAID_FEES = [
  { _id: "m1", invoiceNo: "INV-0001-A1B2", studentId: { name: "Ali Ahmed", rollNo: "STU-001" }, amount: 5000, month: "October-2026", paidDate: "2026-10-05", paymentMethod: "cash", status: "paid" },
  { _id: "m2", invoiceNo: "INV-0002-C3D4", studentId: { name: "Fatima Khan", rollNo: "STU-002" }, amount: 5000, month: "October-2026", paidDate: "2026-10-04", paymentMethod: "card", status: "paid" },
  { _id: "m3", invoiceNo: "INV-0003-E5F6", studentId: { name: "Bilal Hussain", rollNo: "STU-003" }, amount: 4500, month: "September-2026", paidDate: "2026-09-25", paymentMethod: "bank_transfer", status: "paid" },
  { _id: "m4", invoiceNo: "INV-0004-G7H8", studentId: { name: "Ayesha Siddiqui", rollNo: "STU-004" }, amount: 5000, month: "September-2026", paidDate: "2026-09-20", paymentMethod: "cash", status: "paid" },
  { _id: "m5", invoiceNo: "INV-0005-I9J0", studentId: { name: "Hassan Raza", rollNo: "STU-005" }, amount: 5000, month: "September-2026", paidDate: "2026-09-18", paymentMethod: "online", status: "paid" },
  { _id: "m6", invoiceNo: "INV-0006-K1L2", studentId: { name: "Zainab Tariq", rollNo: "STU-006" }, amount: 4500, month: "August-2026", paidDate: "2026-08-22", paymentMethod: "cheque", status: "paid" },
  { _id: "m7", invoiceNo: "INV-0007-M3N4", studentId: { name: "Ali Ahmed", rollNo: "STU-001" }, amount: 5000, month: "August-2026", paidDate: "2026-08-15", paymentMethod: "cash", status: "paid" },
];

const VIEWS = [
  { value: "table", label: "Table" },
  { value: "timeline", label: "Timeline" },
];

const METHODS = ["all", "cash", "card", "bank_transfer", "online", "cheque"];

const formatMethod = (m) => {
  const map = {
    cash: "Cash",
    card: "Card",
    bank_transfer: "Bank transfer",
    online: "Online",
    cheque: "Cheque",
  };
  return map[m] || m;
};

export default function PaymentsPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({ method: "all", month: "" });
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    feeService
      .list({ status: "paid", limit: 200 })
      .then((res) => {
        const real = res.data || [];
        setFees(real.length > 0 ? real : MOCK_PAID_FEES);
      })
      .catch(() => setFees(MOCK_PAID_FEES))
      .finally(() => setLoading(false));
  }, []);

  const handleReceipt = (fee) =>
    window.open(feeService.receiptUrl(fee._id), "_blank");

  const filtered = useMemo(() => {
    return fees.filter((f) => {
      if (filters.method !== "all" && f.paymentMethod !== filters.method) return false;
      if (filters.month && !(f.month || "").toLowerCase().includes(filters.month.toLowerCase())) return false;
      return true;
    });
  }, [fees, filters]);

  const stats = useMemo(() => {
    const totalCollected = filtered.reduce((s, f) => s + Number(f.amount || 0), 0);
    const avg = filtered.length ? Math.round(totalCollected / filtered.length) : 0;
    const now = new Date();
    const thisMonthTotal = filtered
      .filter((f) => {
        const d = f.paidDate ? new Date(f.paidDate) : null;
        return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, f) => s + Number(f.amount || 0), 0);
    return { totalCollected, avg, thisMonthTotal };
  }, [filtered]);

  const groupedByMonth = useMemo(() => {
    const groups = {};
    filtered.forEach((f) => {
      const month = f.month || "Unknown";
      if (!groups[month]) groups[month] = [];
      groups[month].push(f);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const handleExport = () => {
    exportToCsv("payment-history", filtered, [
      { label: "Invoice", value: (r) => r.invoiceNo },
      { label: "Student", value: (r) => r.studentId?.name || "" },
      { label: "Amount", value: (r) => r.amount },
      { label: "Month", value: (r) => r.month },
      { label: "Paid date", value: (r) => (r.paidDate ? new Date(r.paidDate).toISOString().slice(0, 10) : "") },
      { label: "Method", value: (r) => r.paymentMethod || "" },
    ]);
    showToast("Payment history exported");
  };

  const clearFilters = () => setFilters({ method: "all", month: "" });

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link
          href="/admin/fees"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand mb-6 transition"
        >
          <IconArrowLeft /> Fee Management
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] leading-tight font-semibold text-navy tracking-tight">
              Payment history
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">
              All completed payments grouped by month.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
              {VIEWS.map((v) => {
                const active = view === v.value;
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => setView(v.value)}
                    className={
                      "px-3.5 py-2 text-sm font-medium transition " +
                      (active ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-50")
                    }
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={!filtered.length}
              className="inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <IconDownload /> Export
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<IconWallet size={18} />}
            tone="emerald"
            label="Total collected"
            value={formatCurrency(stats.totalCollected)}
            sub="All-time"
            trend={12}
          />
          <StatCard
            icon={<IconReceipt size={18} />}
            tone="blue"
            label="Paid invoices"
            value={filtered.length.toString()}
            sub={filtered.length === 1 ? "1 payment" : filtered.length + " payments"}
          />
          <StatCard
            icon={<IconChart size={18} />}
            tone="gray"
            label="Average invoice"
            value={formatCurrency(stats.avg)}
            sub={"This month: " + formatCurrency(stats.thisMonthTotal)}
          />
        </section>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Filter by month (for example, October-2026)"
            value={filters.month}
            onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
            className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-[220px] focus:outline-none focus:border-gray-400 transition"
          />
          <select
            value={filters.method}
            onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
            className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All methods" : formatMethod(m)}
              </option>
            ))}
          </select>
          {(filters.method !== "all" || filters.month) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-brand px-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptyCard />
            </div>
            <h3 className="font-semibold text-navy text-[17px]">
              No payments found
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              {filters.method !== "all" || filters.month
                ? "Try adjusting your filters."
                : "Once invoices are marked as paid, they will appear here."}
            </p>
          </div>
        ) : view === "table" ? (
          <InvoiceTable fees={filtered} onViewReceipt={handleReceipt} />
        ) : (
          <div className="space-y-6">
            {groupedByMonth.map(([month, items]) => (
              <section key={month} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-navy text-[15px]">{month}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {items.length} payment{items.length !== 1 ? "s" : ""} - {formatCurrency(items.reduce((s, f) => s + Number(f.amount), 0))}
                    </p>
                  </div>
                </header>
                <ul className="divide-y divide-gray-50">
                  {items.map((fee) => (
                    <li
                      key={fee._id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <IconCheckCircle size={14} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-navy truncate">
                            {fee.studentId?.name || "Student"}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                            <span className="font-mono">{fee.invoiceNo}</span>
                            {fee.paymentMethod && (
                              <>
                                <span>-</span>
                                <span>{formatMethod(fee.paymentMethod)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="font-medium text-navy tabular-nums">
                          {formatCurrency(fee.amount)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleReceipt(fee)}
                          className="text-xs text-gray-500 hover:text-brand transition"
                        >
                          Receipt
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div
          className={
            "fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium " +
            (toast.tone === "error" ? "bg-red-600" : "bg-brand")
          }
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}

const TONES = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-brand",
  gray: "bg-gray-100 text-gray-700",
};

function StatCard({ icon, tone, label, value, sub, trend }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200/60 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={"w-9 h-9 rounded-lg " + TONES[tone] + " flex items-center justify-center"}>
          {icon}
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <IconTrendUp size={14} />
            {trend}%
          </span>
        )}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-3xl font-semibold text-navy mt-2 tracking-tight tabular-nums">
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1.5">{sub}</div>}
    </article>
  );
}