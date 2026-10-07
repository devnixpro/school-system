"use client";

import { useEffect, useMemo, useState } from "react";
import FeeCard from "@/components/common/FeeCard";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";
import { IconEmptyReceipt } from "@/components/common/FeeIcons";

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

  const { paid, due, paidTotal, dueTotal, nextDueDate, overdueCount } = useMemo(() => {
    const paid = fees.filter((f) => f.status === "paid");
    const due = fees.filter((f) => f.status !== "paid");
    const overdueCount = due.filter((f) => f.status === "overdue").length;
    const nextDueDate = due
      .filter((f) => f.status === "pending")
      .map((f) => f.dueDate)
      .filter(Boolean)
      .sort()[0];
    return {
      paid, due,
      paidTotal: paid.reduce((s, f) => s + Number(f.amount), 0),
      dueTotal: due.reduce((s, f) => s + Number(f.amount), 0),
      overdueCount, nextDueDate,
    };
  }, [fees]);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-gray-900 tracking-tight">
            My Fees
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">Your fee history and receipts.</p>
        </div>

        {!loading && (
          <section className="bg-white rounded-2xl border border-gray-200/60 p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500">
                  {dueTotal > 0 ? "Outstanding balance" : "You're all caught up"}
                </div>
                <div className={`text-[44px] leading-none font-semibold mt-3 tracking-tight tabular-nums ${
                  dueTotal > 0 ? "text-gray-900" : "text-emerald-600"
                }`}>
                  {formatCurrency(dueTotal)}
                </div>
                <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                  {dueTotal > 0 ? (
                    <>
                      <span>{due.length} invoice{due.length !== 1 ? "s" : ""} due</span>
                      {overdueCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {overdueCount} overdue
                        </span>
                      )}
                    </>
                  ) : (
                    <span>No pending payments</span>
                  )}
                </div>
              </div>

              {nextDueDate && (
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Next due</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(nextDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total paid</div>
            <div className="text-2xl font-semibold text-gray-900 mt-3 tracking-tight tabular-nums">
              {formatCurrency(paidTotal)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {paid.length} invoice{paid.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total records</div>
            <div className="text-2xl font-semibold text-gray-900 mt-3 tracking-tight">{fees.length}</div>
            <div className="text-xs text-gray-400 mt-1">All-time</div>
          </div>
        </section>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/60 h-40 animate-pulse" />
            ))}
          </div>
        ) : fees.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptyReceipt />
            </div>
            <h3 className="font-semibold text-gray-900 text-[17px]">No fees yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Your fee records will appear here once the school publishes them.
            </p>
          </div>
        ) : (
          <>
            {due.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 text-[17px]">Outstanding</h2>
                  <span className="text-sm text-gray-500">{due.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {due.map((f) => <FeeCard key={f._id} fee={f} onViewReceipt={handleReceipt} />)}
                </div>
              </section>
            )}
            {paid.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 text-[17px]">Paid</h2>
                  <span className="text-sm text-gray-500">{paid.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paid.map((f) => <FeeCard key={f._id} fee={f} onViewReceipt={handleReceipt} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}