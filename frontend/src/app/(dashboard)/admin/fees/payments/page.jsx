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
        <h1 className="font-poppins text-3xl font-bold text-navy-900">Payment History</h1>
        <p className="text-navy-500 text-sm mt-1">All completed payments.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-green-50 border-green-200 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-green-700">Total Collected</div>
          <div className="font-poppins text-2xl font-bold text-green-900 mt-2">{formatCurrency(totalCollected)}</div>
          <div className="text-xs text-navy-500 mt-1">All-time</div>
        </div>
        <div className="rounded-2xl border bg-brand-50 border-brand-200 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">Paid Invoices</div>
          <div className="font-poppins text-2xl font-bold text-brand-900 mt-2">{fees.length}</div>
          <div className="text-xs text-navy-500 mt-1">Records</div>
        </div>
        <div className="rounded-2xl border bg-navy-50 border-navy-200 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">Average</div>
          <div className="font-poppins text-2xl font-bold text-navy-900 mt-2">{formatCurrency(avg)}</div>
          <div className="text-xs text-navy-500 mt-1">Per invoice</div>
        </div>
      </section>

      {loading ? (
        <div className="bg-white rounded-2xl border border-navy-100 py-16 text-center text-navy-400">Loading…</div>
      ) : (
        <InvoiceTable fees={fees} onViewReceipt={handleReceipt} />
      )}
    </main>
  );
}