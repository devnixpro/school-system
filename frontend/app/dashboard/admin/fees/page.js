"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import FeePaymentModal from "@/components/common/FeePaymentModal";
import FeeAnalyticsSection from "@/components/admin/FeeAnalyticsSection";
import { feeService } from "@/services/feeService";
import { exportToCsv } from "@/utils/exportToCsv";

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

  useEffect(() => { load(); }, [load]);

  const handlePay = async (payload) => {
    // Optimistic update
    const prev = fees;
    setFees((fs) =>
      fs.map((f) =>
        f._id === selected._id
          ? { ...f, status: "paid", paidDate: new Date().toISOString(), ...payload }
          : f
      )
    );
    setSelected(null);
    try {
      await feeService.markPaid(selected._id, payload);
      showToast("Payment recorded");
    } catch (err) {
      setFees(prev);
      showToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const handleDelete = async (fee) => {
    if (!confirm(`Delete invoice ${fee.invoiceNo}?`)) return;
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

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  const handleBulkPaid = async (selectedFees) => {
    if (!confirm(`Mark ${selectedFees.length} invoices as paid?`)) return;
    try {
      await Promise.all(
        selectedFees.map((f) => feeService.markPaid(f._id, { paymentMethod: "cash" }))
      );
      showToast(`${selectedFees.length} invoices marked paid`);
      load();
    } catch (err) {
      showToast("Some payments failed", "error");
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
      { label: "Due Date", value: (r) => r.dueDate ? new Date(r.dueDate).toISOString().slice(0,10) : "" },
    ]);
    showToast("CSV exported");
  };

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track invoices, payments, and receipts across your school.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50"
          >
            Export CSV
          </button>
          <Link
            href="/dashboard/admin/fees/structure"
            className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            + Generate Invoices
          </Link>
        </div>
      </header>

      <FeeAnalyticsSection />

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Filter by month (e.g. October-2026)"
          value={filters.month}
          onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm flex-1 min-w-[220px]"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button
          onClick={() => setFilters({ status: "", month: "" })}
          className="text-sm text-gray-500 hover:text-blue-600 px-2"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
          Loading…
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
            <Link href="/dashboard/admin/fees/structure" className="btn-primary">
              Generate First Invoice
            </Link>
          }
        />
      )}

      <FeePaymentModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        fee={selected}
        onConfirm={handlePay}
      />

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium text-sm ${
            toast.tone === "error" ? "bg-red-600" : "bg-gray-900"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}