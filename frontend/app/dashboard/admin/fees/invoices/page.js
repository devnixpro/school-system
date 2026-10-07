"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import FeePaymentModal from "@/components/common/FeePaymentModal";
import { feeService } from "@/services/feeService";
import { exportToCsv } from "@/utils/exportToCsv";
import { formatCurrency } from "@/utils/formatCurrency";

const STATUS_CHIPS = [
  { value: "",       label: "All",      color: "bg-gray-100 text-gray-700" },
  { value: "paid",   label: "Paid",     color: "bg-green-100 text-green-700" },
  { value: "pending",label: "Pending",  color: "bg-yellow-100 text-yellow-700" },
  { value: "overdue",label: "Overdue",  color: "bg-red-100 text-red-700" },
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
    feeService.list({ status, month, limit: 100 })
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]))
      .finally(() => setLoading(false));
  }, [status, month]);

  useEffect(() => { load(); }, [load]);

  const handlePay = async (payload) => {
    try {
      await feeService.markPaid(selected._id, payload);
      setSelected(null);
      showToast("Payment recorded");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  const handleExport = () => {
    exportToCsv("all-invoices", fees, [
      { label: "Invoice", value: (r) => r.invoiceNo },
      { label: "Student", value: (r) => r.studentId?.name || "" },
      { label: "Roll No", value: (r) => r.studentId?.rollNo || "" },
      { label: "Month", value: (r) => r.month },
      { label: "Amount", value: (r) => r.amount },
      { label: "Status", value: (r) => r.status },
    ]);
    showToast("CSV exported");
  };

  const counts = useMemo(() => ({
    all: fees.length,
    paid: fees.filter((f) => f.status === "paid").length,
    pending: fees.filter((f) => f.status === "pending").length,
    overdue: fees.filter((f) => f.status === "overdue").length,
  }), [fees]);

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/admin/fees" className="hover:text-blue-600">Fee Management</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">All Invoices</span>
      </nav>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">
            {counts.all} invoice{counts.all !== 1 ? "s" : ""} · {counts.paid} paid · {counts.pending} pending · {counts.overdue} overdue
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={!fees.length}
          className="inline-flex items-center gap-2 justify-center font-semibold rounded-xl px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
        >
          <span>⬇</span> Export CSV
        </button>
      </header>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_CHIPS.map((chip) => {
          const active = status === chip.value;
          const count = chip.value === "" ? counts.all : counts[chip.value];
          return (
            <button
              key={chip.value}
              onClick={() => setStatus(chip.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                active
                  ? "ring-2 ring-blue-500 ring-offset-1 " + chip.color
                  : chip.color + " opacity-70 hover:opacity-100"
              }`}
            >
              {chip.label}
              <span className="ml-2 text-xs opacity-80">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Filter by month (e.g. October-2026)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm flex-1 min-w-[220px]"
        />
        <button
          onClick={() => { setMonth(""); setStatus(""); }}
          className="text-sm text-gray-500 hover:text-blue-600 px-2"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-3 animate-pulse">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <div className="text-6xl mb-4">🧾</div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">No invoices found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            {status || month
              ? "No invoices match your filters. Try adjusting or reset."
              : "Generate your first batch of fee invoices to see them here."}
          </p>
          <Link href="/dashboard/admin/fees/structure" className="btn-primary">
            Generate First Invoice
          </Link>
        </div>
      ) : (
        <InvoiceTable fees={fees} onPay={setSelected} onViewReceipt={handleReceipt} />
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