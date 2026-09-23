"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import InvoiceTable from "@/components/admin/InvoiceTable";
import FeePaymentModal from "@/components/common/FeePaymentModal";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";

export default function AdminFeesPage() {
  const [fees, setFees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: "", month: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [feesRes, statsRes] = await Promise.all([
        feeService.list({ ...filters, limit: 50 }),
        feeService.analytics(),
      ]);
      setFees(feesRes.data || []);
      setAnalytics(statsRes.data || null);
    } catch {
      setFees([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.month]);

  useEffect(() => { load(); }, [load]);

  const handlePay = async (payload) => {
    try {
      await feeService.markPaid(selected._id, payload);
      setSelected(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const handleDelete = async (fee) => {
    if (!confirm(`Delete invoice ${fee.invoiceNo}?`)) return;
    try {
      await feeService.remove(fee._id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-poppins text-3xl font-bold text-navy-900">Fee Management</h1>
          <p className="text-navy-500 text-sm mt-1">Track invoices, payments, and receipts across your school.</p>
        </div>
        <Link href="/admin/fees/structure"
          className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 bg-brand text-white hover:bg-brand-600 transition shadow-sm shadow-brand/30">
          + Generate Invoices
        </Link>
      </header>

      {analytics && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Paid", value: formatCurrency(analytics.paid.total), sub: `${analytics.paid.count} invoices`, tone: "bg-green-50 border-green-200 text-green-900" },
            { label: "Pending", value: formatCurrency(analytics.pending.total), sub: `${analytics.pending.count} invoices`, tone: "bg-yellow-50 border-yellow-200 text-yellow-900" },
            { label: "Overdue", value: formatCurrency(analytics.overdue.total), sub: `${analytics.overdue.count} invoices`, tone: "bg-red-50 border-red-200 text-red-900" },
            { label: "Collection Rate", value: `${analytics.collectionRate}%`, sub: "All-time", tone: "bg-brand-50 border-brand-200 text-brand-900" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.tone}`}>
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{s.label}</div>
              <div className="font-poppins text-2xl font-bold mt-2">{s.value}</div>
              <div className="text-xs opacity-70 mt-1">{s.sub}</div>
            </div>
          ))}
        </section>
      )}

      <div className="bg-white rounded-2xl border border-navy-100 p-4 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Filter by month (e.g. October-2026)"
          value={filters.month} onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
          className="px-4 py-2 border border-navy-200 rounded-xl text-sm flex-1 min-w-[220px] outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand" />
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="px-4 py-2 border border-navy-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button onClick={() => setFilters({ status: "", month: "" })}
          className="text-sm text-navy-500 hover:text-brand px-2">Reset</button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-navy-100 py-16 text-center text-navy-400">Loading…</div>
      ) : (
        <InvoiceTable fees={fees} onPay={setSelected} onDelete={handleDelete} onViewReceipt={handleReceipt} />
      )}

      <FeePaymentModal isOpen={!!selected} onClose={() => setSelected(null)} fee={selected} onConfirm={handlePay} />
    </main>
  );
}