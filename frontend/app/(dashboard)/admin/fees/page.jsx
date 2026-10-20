"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import FeePaymentModal from "@/components/common/FeePaymentModal";
import FeeAnalyticsSection from "@/components/admin/FeeAnalyticsSection";
import { feeService } from "@/services/feeService";
import { exportToCsv } from "@/utils/exportToCsv";
import { IconPlus, IconDownload } from "@/components/common/FeeIcons";

export default function AdminFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: "", month: "" });
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await feeService.list({ ...filters, limit: 100 });
      setFees(res.data || []);
    } catch {
      setFees([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.month]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePay = async (payload) => {
    const prev = fees;
    setFees((fs) =>
      fs.map((f) =>
        f._id === selected._id
          ? {
              ...f,
              status: "paid",
              paidDate: new Date().toISOString(),
              ...payload,
            }
          : f
      )
    );
    setSelected(null);
    try {
      await feeService.markPaid(selected._id, payload);
      showToast("Payment recorded successfully");
    } catch (err) {
      setFees(prev);
      showToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const handleDelete = async (fee) => {
    if (!confirm(`Delete invoice ${fee.invoiceNo}? This cannot be undone.`))
      return;
    const prev = fees;
    setFees((fs) => fs.filter((f) => f._id !== fee._id));
    try {
      await feeService.remove(fee._id);
      showToast("Invoice deleted");
    } catch (err) {
      setFees(prev);
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleReceipt = (fee) =>
    window.open(feeService.receiptUrl(fee._id), "_blank");

  const handleBulkPaid = async (selectedFees) => {
    if (!confirm(`Mark ${selectedFees.length} invoices as paid?`)) return;
    try {
      await Promise.all(
        selectedFees.map((f) =>
          feeService.markPaid(f._id, { paymentMethod: "cash" })
        )
      );
      showToast(`${selectedFees.length} invoices marked as paid`);
      load();
    } catch {
      showToast("Some payments could not be processed", "error");
    }
  };

  const handleExport = () => {
    exportToCsv("fee-invoices", fees, [
      { label: "Invoice", value: (r) => r.invoiceNo },
      { label: "Student", value: (r) => r.studentId?.name || "" },
      { label: "Roll No", value: (r) => r.studentId?.rollNo || "" },
      { label: "Month", value: (r) => r.month },
      { label: "Amount", value: (r) => r.amount },
      { label: "Status", value: (r) => r.status },
    ]);
    showToast("Invoices exported");
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-navy tracking-tight">
            Fee Management
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            Track invoices, payments, and receipts across your school.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={handleExport}
            disabled={!fees.length}
            className="inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition"
          >
            <IconDownload /> Export CSV
          </button>
          <Link
            href="/admin/fees/hub"
            className="inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition"
          >
            Browse all pages
          </Link>
          <Link
            href="/admin/fees/structure"
            className="inline-flex items-center gap-2 font-medium rounded-lg px-4 py-2 text-sm bg-brand text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition"
          >
            <IconPlus /> Generate invoices
          </Link>
        </div>

        <FeeAnalyticsSection />

        <div className="bg-white rounded-2xl border border-gray-200/60 p-4 mt-6 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Filter by month (for example, October-2026)"
            aria-label="Filter by month"
            value={filters.month}
            onChange={(e) =>
              setFilters((f) => ({ ...f, month: e.target.value }))
            }
            className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-[220px] focus:outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 transition"
          />
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
            className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 transition"
          >
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            type="button"
            onClick={() => setFilters({ status: "", month: "" })}
            className="text-sm text-gray-500 hover:text-brand px-2 focus:outline-none focus-visible:underline transition"
          >
            Reset filters
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <InvoiceTable
            fees={fees}
            onPay={setSelected}
            onDelete={handleDelete}
            onViewReceipt={handleReceipt}
            onBulkPaid={handleBulkPaid}
            enableSelection
            emptyAction={
              <Link
                href="/admin/fees/structure"
                className="inline-flex items-center justify-center font-medium rounded-lg px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition"
              >
                Generate first invoice
              </Link>
            }
          />
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
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
            toast.tone === "error" ? "bg-red-600" : "bg-brand"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}