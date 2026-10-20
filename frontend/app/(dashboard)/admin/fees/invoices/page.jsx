"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import FeePaymentModal from "@/components/common/FeePaymentModal";
import { feeService } from "@/services/feeService";
import { exportToCsv } from "@/utils/exportToCsv";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  IconArrowLeft,
  IconDownload,
  IconEmptyReceipt,
  IconWallet,
  IconReceipt,
  IconAlert,
  IconCheckCircle,
  IconClock,
} from "@/components/common/FeeIcons";

// Fallback mock data (used when the backend is offline)
const MOCK_FEES = [
  { _id: "m1", invoiceNo: "INV-0001-A1B2", studentId: { name: "Ali Ahmed", rollNo: "STU-001" }, amount: 5000, month: "October-2026", dueDate: "2026-10-15", paidDate: null, status: "pending" },
  { _id: "m2", invoiceNo: "INV-0002-C3D4", studentId: { name: "Fatima Khan", rollNo: "STU-002" }, amount: 5000, month: "October-2026", dueDate: "2026-10-15", paidDate: "2026-10-05", status: "paid" },
  { _id: "m3", invoiceNo: "INV-0003-E5F6", studentId: { name: "Bilal Hussain", rollNo: "STU-003" }, amount: 4500, month: "September-2026", dueDate: "2026-09-20", paidDate: null, status: "overdue" },
  { _id: "m4", invoiceNo: "INV-0004-G7H8", studentId: { name: "Ayesha Siddiqui", rollNo: "STU-004" }, amount: 5000, month: "September-2026", dueDate: "2026-09-20", paidDate: "2026-09-18", status: "paid" },
  { _id: "m5", invoiceNo: "INV-0005-I9J0", studentId: { name: "Hassan Raza", rollNo: "STU-005" }, amount: 5000, month: "September-2026", dueDate: "2026-09-20", paidDate: "2026-09-19", status: "paid" },
  { _id: "m6", invoiceNo: "INV-0006-K1L2", studentId: { name: "Zainab Tariq", rollNo: "STU-006" }, amount: 4500, month: "October-2026", dueDate: "2026-10-10", paidDate: null, status: "overdue" },
  { _id: "m7", invoiceNo: "INV-0007-M3N4", studentId: { name: "Ali Ahmed", rollNo: "STU-001" }, amount: 5000, month: "August-2026", dueDate: "2026-08-20", paidDate: "2026-08-15", status: "paid" },
  { _id: "m8", invoiceNo: "INV-0008-O5P6", studentId: { name: "Fatima Khan", rollNo: "STU-002" }, amount: 5000, month: "August-2026", dueDate: "2026-08-20", paidDate: "2026-08-18", status: "paid" },
];

const STATUS_TABS = [
  { value: "", label: "All", icon: <IconReceipt size={14} /> },
  { value: "paid", label: "Paid", icon: <IconCheckCircle size={14} /> },
  { value: "pending", label: "Pending", icon: <IconClock size={14} /> },
  { value: "overdue", label: "Overdue", icon: <IconAlert size={14} /> },
];

export default function InvoicesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(() => {
    setLoading(true);
    feeService
      .list({ status, month, limit: 100 })
      .then((res) => {
        const real = res.data || [];
        setFees(real.length > 0 ? real : MOCK_FEES);
      })
      .catch(() => setFees(MOCK_FEES))
      .finally(() => setLoading(false));
  }, [status, month]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePay = async (payload) => {
    try {
      await feeService.markPaid(selected._id, payload);
      setSelected(null);
      showToast("Payment recorded successfully");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const handleReceipt = (fee) =>
    window.open(feeService.receiptUrl(fee._id), "_blank");

  const handleExport = () => {
    exportToCsv("all-invoices", fees, [
      { label: "Invoice", value: (r) => r.invoiceNo },
      { label: "Student", value: (r) => r.studentId?.name || "" },
      { label: "Roll No", value: (r) => r.studentId?.rollNo || "" },
      { label: "Month", value: (r) => r.month },
      { label: "Amount", value: (r) => r.amount },
      { label: "Status", value: (r) => r.status },
    ]);
    showToast("Invoices exported");
  };

  const counts = useMemo(() => {
    const paid = fees.filter((f) => f.status === "paid");
    const pending = fees.filter((f) => f.status === "pending");
    const overdue = fees.filter((f) => f.status === "overdue");
    const totalAmount = fees.reduce((s, f) => s + Number(f.amount || 0), 0);
    const collected = paid.reduce((s, f) => s + Number(f.amount || 0), 0);
    const outstanding = pending.reduce((s, f) => s + Number(f.amount || 0), 0) +
                        overdue.reduce((s, f) => s + Number(f.amount || 0), 0);
    return {
      all: fees.length,
      paid: paid.length,
      pending: pending.length,
      overdue: overdue.length,
      totalAmount,
      collected,
      outstanding,
    };
  }, [fees]);

  const visibleFees = useMemo(() => {
    let list = fees;
    if (status) list = list.filter((f) => f.status === status);
    if (month) list = list.filter((f) => (f.month || "").toLowerCase().includes(month.toLowerCase()));
    return list;
  }, [fees, status, month]);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <Link
          href="/admin/fees"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand mb-6 transition"
        >
          <IconArrowLeft /> Fee Management
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] leading-tight font-semibold text-navy tracking-tight">
              All invoices
            </h1>
            <p className="text-gray-500 mt-2 text-[15px]">
              Browse, search, and filter every fee invoice for your school.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={!visibleFees.length}
            className="inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition"
          >
            <IconDownload /> Export CSV
          </button>
        </div>

        {/* KPI cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KPI
            icon={<IconReceipt size={16} />}
            tone="blue"
            label="Total invoices"
            value={counts.all.toString()}
            sub={formatCurrency(counts.totalAmount)}
          />
          <KPI
            icon={<IconCheckCircle size={16} />}
            tone="emerald"
            label="Paid"
            value={counts.paid.toString()}
            sub={formatCurrency(counts.collected)}
          />
          <KPI
            icon={<IconClock size={16} />}
            tone="amber"
            label="Pending"
            value={counts.pending.toString()}
            sub={counts.pending > 0 ? "Awaiting payment" : "None"}
          />
          <KPI
            icon={<IconAlert size={16} />}
            tone="red"
            label="Overdue"
            value={counts.overdue.toString()}
            sub={counts.overdue > 0 ? "Action required" : "All clear"}
          />
        </section>

        {/* Filter card */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-4 mb-6">
          {/* Status tabs */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.value;
              const count = tab.value === "" ? counts.all : counts[tab.value];
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  className={
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition " +
                    (active
                      ? "bg-brand text-white"
                      : "text-gray-600 hover:bg-gray-100")
                  }
                >
                  <span className={active ? "text-gray-300" : "text-gray-400"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                  <span
                    className={
                      "ml-0.5 text-xs tabular-nums " +
                      (active ? "text-gray-300" : "text-gray-400")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Month filter */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Filter by month (for example, October-2026)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-[220px] focus:outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 transition"
            />
            {(month || status) && (
              <button
                type="button"
                onClick={() => {
                  setMonth("");
                  setStatus("");
                }}
                className="text-sm text-gray-500 hover:text-brand px-2 focus:outline-none focus-visible:underline transition"
              >
                Clear filters
              </button>
            )}
            <span className="text-xs text-gray-400">
              Showing {visibleFees.length} of {counts.all}
            </span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : visibleFees.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptyReceipt />
            </div>
            <h3 className="font-semibold text-navy text-[17px]">
              {status || month ? "No matching invoices" : "No invoices yet"}
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              {status || month
                ? "Try adjusting your filters or clear them to see all invoices."
                : "Generate your first batch of invoices to get started."}
            </p>
            {!status && !month && (
              <Link
                href="/admin/fees/structure"
                className="inline-flex items-center justify-center font-medium rounded-lg px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 mt-6 transition"
              >
                Generate invoices
              </Link>
            )}
          </div>
        ) : (
          <InvoiceTable fees={visibleFees} onPay={setSelected} onViewReceipt={handleReceipt} />
        )}
      </div>

      <FeePaymentModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        fee={selected}
        onConfirm={handlePay}
      />

      {toast && (
        <div
          role="status"
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

const KPI_TONES = {
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-brand",
  red: "bg-red-50 text-red-600",
};

function KPI({ icon, tone, label, value, sub }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200/60 p-5 hover:shadow-md transition-shadow">
      <div className={"w-9 h-9 rounded-lg " + KPI_TONES[tone] + " flex items-center justify-center mb-3"}>
        {icon}
      </div>
      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-semibold text-navy mt-2 tracking-tight tabular-nums">
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1 truncate">{sub}</div>}
    </article>
  );
}