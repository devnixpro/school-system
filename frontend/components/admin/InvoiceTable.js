"use client";

import { memo, useMemo, useState } from "react";
import PaymentStatusBadge from "@/components/common/PaymentStatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const PAGE_SIZE = 15;

function InvoiceTable({
  fees = [],
  onPay,
  onViewReceipt,
  onDelete,
  onBulkPaid,
  enableSelection = false,
  emptyAction,
}) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return fees;
    const q = query.toLowerCase();
    return fees.filter((f) => {
      const name = f.studentId?.name?.toLowerCase() || "";
      const roll = f.studentId?.rollNo?.toLowerCase() || "";
      const inv = f.invoiceNo?.toLowerCase() || "";
      return name.includes(q) || roll.includes(q) || inv.includes(q);
    });
  }, [fees, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () => {
    const ids = paged.map((f) => f._id);
    const all = ids.every((id) => selected.includes(id));
    setSelected(
      all
        ? selected.filter((id) => !ids.includes(id))
        : [...new Set([...selected, ...ids])]
    );
  };

  const markSelectedPaid = () => {
    if (!onBulkPaid || !selected.length) return;
    onBulkPaid(paged.filter((f) => selected.includes(f._id)));
    setSelected([]);
  };

  if (!fees.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/60 py-16 text-center">
        <h3 className="font-semibold text-navy text-[15px] mb-1">
          No invoices yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
          Generate your first batch of fee invoices to see them here.
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Search by student, roll number, or invoice number"
          aria-label="Search invoices"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-[220px] focus:outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 transition"
        />
        {enableSelection && selected.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600">
              {selected.length} selected
            </span>
            {onBulkPaid && (
              <button
                type="button"
                onClick={markSelectedPaid}
                className="text-xs font-medium bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition"
              >
                Mark as paid
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {enableSelection && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all on this page"
                    checked={
                      paged.length > 0 &&
                      paged.every((f) => selected.includes(f._id))
                    }
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
              )}
              {["Invoice", "Student", "Month", "Amount", "Due", "Status", "Actions"].map(
                (h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={`px-5 py-3 font-medium text-[11px] uppercase tracking-wide text-gray-500 ${
                      i === 3 || i === 6 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.map((fee) => (
              <tr key={fee._id} className="hover:bg-gray-50/60 transition-colors">
                {enableSelection && (
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      aria-label={`Select invoice ${fee.invoiceNo}`}
                      checked={selected.includes(fee._id)}
                      onChange={() => toggleOne(fee._id)}
                      className="rounded"
                    />
                  </td>
                )}
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                  {fee.invoiceNo}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-navy">
                    {fee.studentId?.name || ""}
                  </div>
                  {fee.studentId?.rollNo && (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {fee.studentId.rollNo}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{fee.month}</td>
                <td className="px-5 py-3.5 text-right font-medium text-navy tabular-nums">
                  {formatCurrency(fee.amount)}
                </td>
                <td className="px-5 py-3.5 text-gray-600 tabular-nums text-[13px]">
                  {formatDate(fee.dueDate)}
                </td>
                <td className="px-5 py-3.5">
                  <PaymentStatusBadge status={fee.status} size="sm" />
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {onViewReceipt && (
                      <button
                        type="button"
                        onClick={() => onViewReceipt(fee)}
                        className="text-gray-500 hover:text-navy px-2 py-1 rounded-md hover:bg-gray-100 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition"
                      >
                        Receipt
                      </button>
                    )}
                    {fee.status !== "paid" && onPay && (
                      <button
                        type="button"
                        onClick={() => onPay(fee)}
                        className="text-navy hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition"
                      >
                        Pay
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(fee)}
                        className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-md text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
          <span className="text-gray-500 text-xs tabular-nums">
            {(page - 1) * PAGE_SIZE + 1}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-xs text-gray-600 tabular-nums">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 transition"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default memo(InvoiceTable);