"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";
import { exportToCsv } from "@/utils/exportToCsv";

export default function PaymentsPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table"); // table | timeline

  useEffect(() => {
    feeService.list({ status: "paid", limit: 100 })
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  const totalCollected = fees.reduce((s, f) => s + Number(f.amount || 0), 0);
  const avg = fees.length ? Math.round(totalCollected / fees.length) : 0;

  const groupedByMonth = useMemo(() => {
    const groups = {};
    fees.forEach((f) => {
      const month = f.month || "Unknown";
      if (!groups[month]) groups[month] = [];
      groups[month].push(f);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [fees]);

  const handleExport = () => {
    exportToCsv("payment-history", fees, [
      { label: "Invoice", value: (r) => r.invoiceNo },
      { label: "Student", value: (r) => r.studentId?.name || "" },
      { label: "Amount", value: (r) => r.amount },
      { label: "Month", value: (r) => r.month },
      { label: "Paid Date", value: (r) => r.paidDate ? new Date(r.paidDate).toISOString().slice(0,10) : "" },
      { label: "Method", value: (r) => r.paymentMethod || "" },
    ]);
  };

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/admin/fees" className="hover:text-blue-600">Fee Management</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Payment History</span>
      </nav>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-500 text-sm mt-1">All completed payments, grouped by month.</p>
        </div>
        <div className="flex gap-2">
          <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2 text-xs font-medium ${view === "table" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Table
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`px-3 py-2 text-xs font-medium ${view === "timeline" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              Timeline
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={!fees.length}
            className="inline-flex items-center gap-2 font-semibold rounded-xl px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            <span>⬇</span> Export CSV
          </button>
        </div>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-green-50 border-green-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-semibold uppercase text-green-700">Total Collected</div>
            <span className="text-xl">💰</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(totalCollected)}</div>
          <div className="text-xs text-gray-500 mt-1">All-time</div>
        </div>
        <div className="rounded-2xl border bg-blue-50 border-blue-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-semibold uppercase text-blue-700">Paid Invoices</div>
            <span className="text-xl">✅</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{fees.length}</div>
          <div className="text-xs text-gray-500 mt-1">Records</div>
        </div>
        <div className="rounded-2xl border bg-gray-50 border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-semibold uppercase text-gray-700">Average</div>
            <span className="text-xl">📈</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(avg)}</div>
          <div className="text-xs text-gray-500 mt-1">Per invoice</div>
        </div>
      </section>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-3 animate-pulse">
          {[1,2,3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">No payments yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Once invoices are marked paid, they'll appear here.
          </p>
        </div>
      ) : view === "table" ? (
        <InvoiceTable fees={fees} onViewReceipt={handleReceipt} />
      ) : (
        <div className="space-y-6">
          {groupedByMonth.map(([month, items]) => (
            <section key={month} className="bg-white rounded-2xl border border-gray-100 p-5">
              <header className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{month}</h3>
                <div className="text-sm text-gray-500">
                  {items.length} payments · {formatCurrency(items.reduce((s, f) => s + Number(f.amount), 0))}
                </div>
              </header>
              <ul className="space-y-2">
                {items.map((fee) => (
                  <li key={fee._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm">✓</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{fee.studentId?.name || "Student"}</div>
                        <div className="text-xs text-gray-400 font-mono">{fee.invoiceNo}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(fee.amount)}</div>
                      <button
                        onClick={() => handleReceipt(fee)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Receipt →
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}