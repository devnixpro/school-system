"use client";

import { useState } from "react";

const currency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency", currency: "PKR", maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function resolveStatus(fee) {
  const status = String(fee.status || "pending").toLowerCase();
  if (status === "paid") return "paid";
  if (status === "overdue") return "overdue";
  if (fee.dueDate && new Date(fee.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
    return "overdue";
  }
  return "pending";
}

const badgeStyles = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
  overdue: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${badgeStyles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SkeletonRows({ showStudent }) {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={index} className="animate-pulse border-b border-gray-100">
      {Array.from({ length: showStudent ? 6 : 5 }, (_, cell) => (
        <td key={cell} className="px-5 py-5">
          <div className="h-4 rounded-md bg-gray-100" style={{ width: `${55 + ((cell * 17) % 35)}%` }} />
        </td>
      ))}
    </tr>
  ));
}

export default function InvoiceTable({
  fees = [],
  onPay,
  onViewReceipt,
  onDelete,
  showStudent = true,
  loading = false,
  error = "",
  onRetry,
}) {
  const [busyId, setBusyId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState("");

  async function execute(fee, action) {
    const id = String(fee._id || fee.id || "");
    setBusyId(id);
    setActionError("");
    try {
      await action(fee);
    } catch (err) {
      setActionError(err.message || "The operation could not be completed.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {(error || actionError) && (
        <div role="alert" className="flex items-center justify-between gap-3 border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">
          <span>{error || actionError}</span>
          {onRetry && (
            <button onClick={onRetry} className="shrink-0 font-semibold underline">Retry</button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[790px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50/80">
            <tr className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
              <th className="px-5 py-4">Invoice</th>
              {showStudent && <th className="px-5 py-4">Student</th>}
              <th className="px-5 py-4">Billing period</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <SkeletonRows showStudent={showStudent} />
            ) : fees.length === 0 ? (
              <tr>
                <td colSpan={showStudent ? 6 : 5} className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-brand">₨</div>
                  <h3 className="mt-4 font-bold text-navy">Nothing to display yet</h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                    No invoices match this view. Try another filter or check back later.
                  </p>
                </td>
              </tr>
            ) : fees.map((fee) => {
              const id = String(fee._id || fee.id || "");
              const status = resolveStatus(fee);
              const student = fee.student?.name || fee.studentName || fee.student?.fullName || "Student";
              const roll = fee.student?.rollNumber || fee.rollNumber || fee.studentRoll;
              const invoice = fee.invoiceNumber || fee.invoiceNo || `INV-${id.slice(-8)}`;
              const busy = busyId === id;
              const due = fee.dueDate ? new Date(fee.dueDate) : null;

              return (
                <tr key={id} className="group transition-colors hover:bg-blue-50/30">
                  <td className="px-5 py-4">
                    <p className="font-bold text-navy">{invoice}</p>
                    <p className="mt-1 text-xs text-gray-400">Fee invoice</p>
                  </td>

                  {showStudent && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-brand">
                          {student.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{roll ? `Roll no. ${roll}` : "Student account"}</p>
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{fee.month || fee.billingMonth || "—"}</p>
                    <p className={`mt-1 text-xs ${status === "overdue" ? "font-medium text-rose-600" : "text-gray-400"}`}>
                      {due && !Number.isNaN(due.getTime())
                        ? `Due ${due.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}`
                        : "No due date"}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-bold tabular-nums text-navy">{currency(fee.amount)}</td>
                  <td className="px-5 py-4"><StatusBadge status={status} /></td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {status !== "paid" && onPay && (
                        <button
                          disabled={busy}
                          onClick={() => execute(fee, onPay)}
                          className="rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                        >
                          {busy ? "Working..." : "Pay"}
                        </button>
                      )}
                      {onViewReceipt && (
                        <button
                          disabled={busy}
                          onClick={() => execute(fee, onViewReceipt)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:text-brand disabled:opacity-50"
                        >
                          Receipt
                        </button>
                      )}
                      {onDelete && (
                        <button
                          disabled={busy}
                          onClick={() => setDeleteTarget(fee)}
                          aria-label={`Delete invoice ${invoice}`}
                          className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-semibold text-gray-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!loading && fees.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3">
          <span className="text-xs text-gray-500">Showing {fees.length} invoice{fees.length === 1 ? "" : "s"}</span>
          <span className="text-xs font-medium text-gray-500">Amounts in Pakistani Rupees (PKR)</span>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-xl text-rose-600">!</div>
            <h3 id="delete-title" className="mt-4 text-lg font-bold text-navy">Delete this invoice?</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              This action may permanently remove the invoice. Confirm only if you are authorized to delete it.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">Cancel</button>
              <button
                onClick={() => execute(deleteTarget, async (fee) => {
                  await onDelete(fee);
                  setDeleteTarget(null);
                })}
                disabled={Boolean(busyId)}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busyId ? "Deleting..." : "Delete invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}