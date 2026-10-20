"use client";

import { memo } from "react";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";
import { IconReceipt } from "./FeeIcons";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

function FeeCard({ fee, onPay, onViewReceipt }) {
  const accent =
    fee.status === "paid"
      ? "border-l-emerald-500"
      : fee.status === "overdue"
      ? "border-l-red-500"
      : "border-l-amber-500";

  return (
    <article
      className={`bg-white rounded-2xl border border-gray-200/60 border-l-4 ${accent} shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow duration-200 flex flex-col`}
    >
      <header className="p-5 pb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-navy text-[15px] truncate">
            {fee.month}
          </h3>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {fee.studentId?.name || "Student"}
            {fee.studentId?.rollNo ? `  ${fee.studentId.rollNo}` : ""}
          </p>
          <p className="text-[11px] font-mono text-gray-400 mt-1">
            {fee.invoiceNo}
          </p>
        </div>
        <PaymentStatusBadge status={fee.status} />
      </header>

      <div className="px-5 pb-4">
        <div className="text-2xl font-semibold text-navy tracking-tight tabular-nums">
          {formatCurrency(fee.amount)}
        </div>
      </div>

      <dl className="px-5 pb-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-gray-400">
            Due
          </dt>
          <dd className="text-gray-800 font-medium mt-0.5 text-[13px]">
            {formatDate(fee.dueDate)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-gray-400">
            Paid
          </dt>
          <dd className="text-gray-800 font-medium mt-0.5 text-[13px]">
            {formatDate(fee.paidDate)}
          </dd>
        </div>
      </dl>

      <div className="px-5 pb-5 mt-auto flex gap-2">
        {fee.status !== "paid" && onPay && (
          <button
            type="button"
            onClick={() => onPay(fee)}
            className="flex-1 bg-navy text-white font-medium rounded-lg px-4 py-2 text-[13px] hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition"
          >
            Mark as paid
          </button>
        )}
        {onViewReceipt && (
          <button
            type="button"
            onClick={() => onViewReceipt(fee)}
            className={`inline-flex items-center justify-center gap-1.5 font-medium rounded-lg px-4 py-2 text-[13px] text-gray-700 border border-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition ${
              fee.status === "paid" ? "flex-1" : ""
            }`}
          >
            <IconReceipt size={14} />
            Receipt
          </button>
        )}
      </div>
    </article>
  );
}

export default memo(FeeCard);