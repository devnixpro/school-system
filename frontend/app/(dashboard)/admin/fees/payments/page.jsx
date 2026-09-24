"use client";
import { useEffect, useState } from "react";
import InvoiceTable from "@/components/admin/InvoiceTable";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PaymentsPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feeService.list({ status: "paid", limit: 100 })
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  const totalCollected = fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const avg = fees.length ? Math.round(totalCollected / fees.length) : 0;

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 text-sm mt-1">All completed payments.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-green-50 border-green-200 p-5">
          <div className="text-[11px] font-semibold uppercase text-green-700">Total Collected</div>
          <div className="text-2xl font-bold text-green-900 mt-2">{formatCurrency(totalCollected)}</div>
          <div className="text-xs text-gray-500 mt-1">All-time</div>
        </div>
        <div className="rounded-2xl border bg-blue-50 border-blue-200 p-5">
          <div className="text-[11px] font-semibold uppercase text-blue-700">Paid Invoices</div>
          <div className="text-2xl font-bold text-blue-900 mt-2">{fees.length}</div>
          <div className="text-xs text-gray-500 mt-1">Records</div>
        </div>
        <div className="rounded-2xl border bg-gray-50 border-gray-200 p-5">
          <div className="text-[11px] font-semibold uppercase text-gray-700">Average</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(avg)}</div>
          <div className="text-xs text-gray-500 mt-1">Per invoice</div>
        </div>
      </section>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">Loading…</div>
      ) : (
        <InvoiceTable fees={fees} onViewReceipt={handleReceipt} />
      )}
    </main>
  );
}