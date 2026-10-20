"use client";

import { useEffect, useMemo, useState } from "react";
import FeeCard from "@/components/common/FeeCard";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  IconEmptyReceipt,
  IconWallet,
  IconReceipt,
  IconAlert,
  IconCheckCircle,
  IconCalendar,
  IconClock,
} from "@/components/common/FeeIcons";

// Fallback mock data (used when the backend is offline)
const MOCK_STUDENT_FEES = [
  {
    _id: "s1",
    invoiceNo: "INV-2026-10-A1B2",
    studentId: { name: "Ali Ahmed", rollNo: "STU-001" },
    amount: 5000,
    month: "October-2026",
    dueDate: "2026-10-15",
    paidDate: null,
    status: "pending",
  },
  {
    _id: "s2",
    invoiceNo: "INV-2026-09-C3D4",
    studentId: { name: "Ali Ahmed", rollNo: "STU-001" },
    amount: 5000,
    month: "September-2026",
    dueDate: "2026-09-15",
    paidDate: "2026-09-10",
    status: "paid",
  },
  {
    _id: "s3",
    invoiceNo: "INV-2026-08-E5F6",
    studentId: { name: "Ali Ahmed", rollNo: "STU-001" },
    amount: 5000,
    month: "August-2026",
    dueDate: "2026-08-15",
    paidDate: "2026-08-12",
    status: "paid",
  },
  {
    _id: "s4",
    invoiceNo: "INV-2026-07-G7H8",
    studentId: { name: "Ali Ahmed", rollNo: "STU-001" },
    amount: 4500,
    month: "July-2026",
    dueDate: "2026-07-15",
    paidDate: "2026-07-18",
    status: "paid",
  },
  {
    _id: "s5",
    invoiceNo: "INV-2026-06-I9J0",
    studentId: { name: "Ali Ahmed", rollNo: "STU-001" },
    amount: 4500,
    month: "June-2026",
    dueDate: "2026-06-15",
    paidDate: null,
    status: "overdue",
  },
  {
    _id: "s6",
    invoiceNo: "INV-2026-05-K1L2",
    studentId: { name: "Ali Ahmed", rollNo: "STU-001" },
    amount: 4500,
    month: "May-2026",
    dueDate: "2026-05-15",
    paidDate: "2026-05-12",
    status: "paid",
  },
];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
];

const SORTS = [
  { value: "due-desc", label: "Due date (newest)" },
  { value: "due-asc", label: "Due date (oldest)" },
  { value: "amount-desc", label: "Amount (high to low)" },
  { value: "amount-asc", label: "Amount (low to high)" },
];

export default function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("due-desc");

  useEffect(() => {
    feeService
      .list({ limit: 50 })
      .then((res) => {
        const real = res.data || [];
        setFees(real.length > 0 ? real : MOCK_STUDENT_FEES);
      })
      .catch(() => setFees(MOCK_STUDENT_FEES))
      .finally(() => setLoading(false));
  }, []);

  const handleReceipt = (fee) =>
    window.open(feeService.receiptUrl(fee._id), "_blank");

  const stats = useMemo(() => {
    const paid = fees.filter((f) => f.status === "paid");
    const due = fees.filter((f) => f.status !== "paid");
    const overdue = fees.filter((f) => f.status === "overdue");
    const nextDue = due
      .filter((f) => f.status === "pending")
      .map((f) => f.dueDate)
      .filter(Boolean)
      .sort()[0];
    const paidTotal = paid.reduce((s, f) => s + Number(f.amount), 0);
    const dueTotal = due.reduce((s, f) => s + Number(f.amount), 0);
    const grand = paidTotal + dueTotal;
    const progress = grand > 0 ? Math.round((paidTotal / grand) * 100) : 100;
    return { paid, due, overdue, nextDue, paidTotal, dueTotal, progress };
  }, [fees]);

  const visibleFees = useMemo(() => {
    let list = fees;
    if (statusFilter !== "all") {
      list = fees.filter((f) => f.status === statusFilter);
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "due-desc") return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
      if (sort === "due-asc") return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      if (sort === "amount-desc") return Number(b.amount) - Number(a.amount);
      if (sort === "amount-asc") return Number(a.amount) - Number(b.amount);
      return 0;
    });
    return sorted;
  }, [fees, statusFilter, sort]);

  const isEmpty = !loading && fees.length === 0;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-navy tracking-tight">
            My fees
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            View your fee history, download receipts, and check pending dues.
          </p>
        </div>

        {/* Balance card */}
        {!loading && fees.length > 0 && (
          <section
            className={
              "rounded-2xl border p-8 mb-6 " +
              (stats.dueTotal > 0
                ? "bg-white border-gray-200/60"
                : "bg-emerald-50 border-emerald-200/60")
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="text-sm text-gray-500">
                  {stats.dueTotal > 0
                    ? "Outstanding balance"
                    : "You are all caught up"}
                </div>
                <div
                  className={
                    "text-[44px] leading-none font-semibold mt-3 tracking-tight tabular-nums " +
                    (stats.dueTotal > 0 ? "text-navy" : "text-emerald-700")
                  }
                >
                  {formatCurrency(stats.dueTotal)}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                  {stats.dueTotal > 0 ? (
                    <>
                      <span>
                        {stats.due.length} invoice
                        {stats.due.length !== 1 ? "s" : ""} due
                      </span>
                      {stats.overdue.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {stats.overdue.length} overdue
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <IconCheckCircle size={16} />
                      No pending payments
                    </span>
                  )}
                </div>

                {stats.dueTotal > 0 && (
                  <div className="mt-6 max-w-md">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Paid so far</span>
                      <span className="tabular-nums font-medium text-gray-700">
                        {stats.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: stats.progress + "%" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {stats.nextDue && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 shrink-0">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">
                    Next due date
                  </div>
                  <div className="text-sm font-medium text-navy mt-1">
                    {new Date(stats.nextDue).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* KPI row */}
        {!loading && fees.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KPI
              icon={<IconCheckCircle size={16} />}
              tone="emerald"
              label="Paid"
              value={formatCurrency(stats.paidTotal)}
              sub={
                stats.paid.length +
                " invoice" +
                (stats.paid.length !== 1 ? "s" : "")
              }
            />
            <KPI
              icon={<IconWallet size={16} />}
              tone="gray"
              label="Outstanding"
              value={formatCurrency(stats.dueTotal)}
              sub={
                stats.due.length +
                " invoice" +
                (stats.due.length !== 1 ? "s" : "")
              }
            />
            <KPI
              icon={<IconAlert size={16} />}
              tone="red"
              label="Overdue"
              value={stats.overdue.length.toString()}
              sub={stats.overdue.length > 0 ? "Action needed" : "All clear"}
            />
            <KPI
              icon={<IconReceipt size={16} />}
              tone="blue"
              label="Total records"
              value={fees.length.toString()}
              sub="All-time"
            />
          </section>
        )}

        {/* Filter tabs + sort */}
        {!loading && fees.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/60 p-2 mb-6 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 flex-1 overflow-x-auto">
              {STATUS_FILTERS.map((tab) => {
                const active = statusFilter === tab.value;
                const count =
                  tab.value === "all"
                    ? fees.length
                    : fees.filter((f) => f.status === tab.value).length;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={
                      "px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition " +
                      (active
                        ? "bg-brand text-white"
                        : "text-gray-600 hover:bg-gray-100")
                    }
                  >
                    {tab.label}
                    <span
                      className={
                        "ml-1.5 text-xs tabular-nums " +
                        (active ? "text-gray-300" : "text-gray-400")
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200/60 h-44 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state (no data at all) */}
        {isEmpty && (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptyReceipt />
            </div>
            <h3 className="font-semibold text-navy text-[17px]">
              No fees yet
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Your fee records will appear here once the school publishes them.
            </p>
          </div>
        )}

        {/* Fee card grid */}
        {!loading && visibleFees.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy text-[17px]">
                {statusFilter === "all"
                  ? "All invoices"
                  : STATUS_FILTERS.find((s) => s.value === statusFilter)
                      ?.label}
              </h2>
              <span className="text-sm text-gray-500">
                {visibleFees.length} item{visibleFees.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleFees.map((f) => (
                <FeeCard
                  key={f._id}
                  fee={f}
                  onViewReceipt={handleReceipt}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filtered empty state */}
        {!loading && fees.length > 0 && visibleFees.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconCalendar />
            </div>
            <h3 className="font-semibold text-navy text-[17px]">
              No {statusFilter} fees
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Try a different filter to see other invoices.
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className="inline-flex items-center justify-center font-medium rounded-lg px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-600 mt-6 transition"
            >
              Show all invoices
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const KPI_TONES = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-brand",
  red: "bg-red-50 text-red-600",
  gray: "bg-gray-100 text-gray-700",
};

function KPI({ icon, tone, label, value, sub }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200/60 p-5 hover:shadow-md transition-shadow">
      <div
        className={
          "w-8 h-8 rounded-lg " +
          KPI_TONES[tone] +
          " flex items-center justify-center mb-3"
        }
      >
        {icon}
      </div>
      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-xl font-semibold text-navy mt-1.5 tracking-tight tabular-nums">
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1 truncate">{sub}</div>}
    </article>
  );
}