"use client";

import { useEffect, useMemo, useState } from "react";
import FeeCard from "@/components/common/FeeCard";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";
import { IconEmptyUser, IconEmptySearch } from "@/components/common/FeeIcons";

export default function ChildFeesPage() {
  const [childId, setChildId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaid, setShowPaid] = useState(true);

  useEffect(() => {
    if (!childId) { setFees([]); return; }
    setLoading(true);
    feeService.list({ studentId: childId, limit: 50 })
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]))
      .finally(() => setLoading(false));
  }, [childId]);

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  const { due, paid, dueTotal, paidTotal } = useMemo(() => {
    const due = fees.filter((f) => f.status !== "paid");
    const paid = fees.filter((f) => f.status === "paid");
    return {
      due, paid,
      dueTotal: due.reduce((s, f) => s + Number(f.amount), 0),
      paidTotal: paid.reduce((s, f) => s + Number(f.amount), 0),
    };
  }, [fees]);

  const submitChild = (e) => {
    e.preventDefault();
    setChildId(inputValue.trim());
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-gray-900 tracking-tight">
            Child Fees
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            Enter your child&apos;s student ID to view their fee records.
          </p>
        </div>

        <form
          onSubmit={submitChild}
          className="bg-white rounded-2xl border border-gray-200/60 p-4 flex flex-wrap gap-3 items-center sticky top-4 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <label className="text-sm font-medium text-gray-700">Student ID</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="STU-001"
            className="flex-1 min-w-[220px] px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="inline-flex items-center justify-center font-medium rounded-lg px-5 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40 transition"
          >
            Load fees
          </button>
          {childId && (
            <button
              type="button"
              onClick={() => { setChildId(""); setInputValue(""); }}
              className="text-sm text-gray-500 hover:text-gray-900 px-2 transition"
            >
              Clear
            </button>
          )}
        </form>

        {loading && (
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/60 h-40 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && fees.length > 0 && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Outstanding</div>
                <div className={`text-2xl font-semibold mt-3 tracking-tight tabular-nums ${
                  dueTotal > 0 ? "text-red-600" : "text-gray-900"
                }`}>{formatCurrency(dueTotal)}</div>
                <div className="text-xs text-gray-400 mt-1">{due.length} invoice{due.length !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total paid</div>
                <div className="text-2xl font-semibold text-gray-900 mt-3 tracking-tight tabular-nums">{formatCurrency(paidTotal)}</div>
                <div className="text-xs text-gray-400 mt-1">{paid.length} invoice{paid.length !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total records</div>
                <div className="text-2xl font-semibold text-gray-900 mt-3 tracking-tight">{fees.length}</div>
                <div className="text-xs text-gray-400 mt-1">All-time</div>
              </div>
            </section>

            {due.length > 0 && (
              <section className="mt-10">
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
              <section className="mt-10">
                <button
                  onClick={() => setShowPaid((v) => !v)}
                  className="w-full flex items-center justify-between mb-4 group"
                >
                  <h2 className="font-semibold text-gray-900 text-[17px]">Paid ({paid.length})</h2>
                  <span className="text-sm text-gray-500 group-hover:text-gray-900 transition">
                    {showPaid ? "Hide" : "Show"}
                  </span>
                </button>
                {showPaid && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paid.map((f) => <FeeCard key={f._id} fee={f} onViewReceipt={handleReceipt} />)}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {!loading && childId && fees.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center mt-6">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptySearch />
            </div>
            <h3 className="font-semibold text-gray-900 text-[17px]">No fees found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any fee records for ID <span className="font-mono">{childId}</span>.
            </p>
          </div>
        )}

        {!loading && !childId && (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center mt-6">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptyUser />
            </div>
            <h3 className="font-semibold text-gray-900 text-[17px]">Enter a student ID</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Ask your child&apos;s school for their student ID if you don&apos;t have it.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}