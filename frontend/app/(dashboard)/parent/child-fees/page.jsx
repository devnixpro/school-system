"use client";

import { useEffect, useState } from "react";
import ChildSwitcher from "@/components/parent/ChildSwitcher";
import useSelectedChild from "@/components/parent/useSelectedChild";
import { parentService } from "@/services/parentService";
import FeeCard from "@/components/common/FeeCard";
import { feeService } from "@/services/feeService";
import { formatCurrency } from "@/utils/formatCurrency";
import { IconEmptyReceipt } from "@/components/common/FeeIcons";

// Map parent backend status  FeeCard enum
const mapStatus = (status) => {
  if (status === "partial") return "pending";
  if (status === "unpaid") return "overdue";
  return status;
};

export default function ChildFeesPage() {
  const { childList, selectedId, select, loading: childLoading, error: childError } = useSelectedChild();
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setData(null);
    setFetchError("");
    setLoading(true);

    parentService
      .getFees(selectedId)
      .then((d) => {
        if (cancelled) return;
        const normalizedFees = (d?.fees || []).map((f) => ({
          ...f,
          status: mapStatus(f.status),
          studentId: f.studentId || { name: "Your Child" },
        }));
        setData({ ...d, fees: normalizedFees });
      })
      .catch((e) => !cancelled && setFetchError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleReceipt = (fee) => {
    if (!fee._id) return;
    window.open(feeService.receiptUrl(fee._id), "_blank");
  };

  // ----- Child switcher loading -----
  if (childLoading) {
    return (
      <main className="min-h-screen bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="h-8 w-32 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-gray-200/60 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ----- Child switcher error -----
  if (childError) {
    return (
      <main className="min-h-screen bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <p className="text-red-600 text-sm">{childError}</p>
        </div>
      </main>
    );
  }

  const due = (data?.fees || []).filter((f) => f.status !== "paid");
  const paid = (data?.fees || []).filter((f) => f.status === "paid");

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-navy tracking-tight">
            Child Fees
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            View your child&apos;s fee records and download receipts.
          </p>
        </div>

        {/* Child switcher  Mohsin's component */}
        <div className="mb-8">
          <ChildSwitcher
            childList={childList}
            selectedId={selectedId}
            onChange={select}
          />
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm text-red-800">
            {fetchError}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-gray-200/60 animate-pulse" />
            ))}
          </div>
        )}

        {/* No child selected yet */}
        {!loading && !data && !fetchError && (
          <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
              <IconEmptyReceipt />
            </div>
            <h3 className="font-semibold text-navy text-[17px]">
              Select a child
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              Choose a child above to see their fee records.
            </p>
          </div>
        )}

        {/* Data loaded */}
        {data && !loading && (
          <>
            {/* Summary cards  your styling */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  Total
                </div>
                <div className="text-2xl font-semibold text-navy mt-3 tracking-tight tabular-nums">
                  {formatCurrency(data.totals?.total || 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {(data.fees || []).length} invoice{(data.fees || []).length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  Paid
                </div>
                <div className="text-2xl font-semibold text-emerald-600 mt-3 tracking-tight tabular-nums">
                  {formatCurrency(data.totals?.paid || 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {paid.length} invoice{paid.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  Due
                </div>
                <div
                  className={`text-2xl font-semibold mt-3 tracking-tight tabular-nums ${
                    (data.totals?.due || 0) > 0 ? "text-red-600" : "text-navy"
                  }`}
                >
                  {formatCurrency(data.totals?.due || 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {due.length} invoice{due.length !== 1 ? "s" : ""}
                </div>
              </div>
            </section>

            {/* Empty state */}
            {data.fees?.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-5 text-gray-300 flex items-center justify-center">
                  <IconEmptyReceipt />
                </div>
                <h3 className="font-semibold text-navy text-[17px]">
                  No fee records
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  This child has no fee records yet.
                </p>
              </div>
            )}

            {/* Outstanding  your FeeCard grid */}
            {due.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-navy text-[17px]">
                    Outstanding
                  </h2>
                  <span className="text-sm text-gray-500">{due.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {due.map((f) => (
                    <FeeCard
                      key={f._id}
                      fee={f}
                      onViewReceipt={handleReceipt}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Paid  your FeeCard grid */}
            {paid.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-navy text-[17px]">
                    Paid
                  </h2>
                  <span className="text-sm text-gray-500">{paid.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paid.map((f) => (
                    <FeeCard
                      key={f._id}
                      fee={f}
                      onViewReceipt={handleReceipt}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}