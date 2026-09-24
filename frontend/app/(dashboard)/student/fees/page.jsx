"use client";
import { useEffect, useState } from "react";
import FeeCard from "@/components/common/FeeCard";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";

export default function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feeService.list({ limit: 50 })
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  const paid = fees.filter((f) => f.status === "paid");
  const due = fees.filter((f) => f.status !== "paid");
  const paidTotal = paid.reduce((s, f) => s + Number(f.amount), 0);
  const dueTotal = due.reduce((s, f) => s + Number(f.amount), 0);

  return (
    <main className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">My Fees</h1>
        <p className="text-gray-500 text-sm mt-1">Your fee history and receipts.</p>
      </header>

      {!loading && fees.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border bg-green-50 border-green-200 p-5">
            <div className="text-[11px] font-semibold uppercase text-green-700">Total Paid</div>
            <div className="text-2xl font-bold text-green-900 mt-2">{formatCurrency(paidTotal)}</div>
            <div className="text-xs text-gray-500 mt-1">{paid.length} invoices</div>
          </div>
          <div className={`rounded-2xl border p-5 ${dueTotal > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
            <div className={`text-[11px] font-semibold uppercase ${dueTotal > 0 ? "text-red-700" : "text-gray-700"}`}>Outstanding</div>
            <div className={`text-2xl font-bold mt-2 ${dueTotal > 0 ? "text-red-900" : "text-gray-900"}`}>{formatCurrency(dueTotal)}</div>
            <div className="text-xs text-gray-500 mt-1">{due.length} invoices</div>
          </div>
          <div className="rounded-2xl border bg-blue-50 border-blue-200 p-5">
            <div className="text-[11px] font-semibold uppercase text-blue-700">Total Records</div>
            <div className="text-2xl font-bold text-blue-900 mt-2">{fees.length}</div>
            <div className="text-xs text-gray-500 mt-1">All-time</div>
          </div>
        </section>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">Loading…</div>
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <div className="text-6xl mb-4">💸</div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">No fees yet</h3>
          <p className="text-sm text-gray-500">Your fee records will appear here once the school publishes them.</p>
        </div>
      ) : (
        <>
          {due.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-3">Outstanding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {due.map((f) => <FeeCard key={f._id} fee={f} onViewReceipt={handleReceipt} />)}
              </div>
            </section>
          )}
          {paid.length > 0 && (
            <section>
              <h2 className="font-semibold text-gray-900 mb-3">Paid</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paid.map((f) => <FeeCard key={f._id} fee={f} onViewReceipt={handleReceipt} />)}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}