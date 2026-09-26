"use client";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function FeeCard({ fee, onPay, onViewReceipt }) {
  const accent =
    fee.status === "paid"    ? "border-l-green-500" :
    fee.status === "overdue" ? "border-l-red-500"   : "border-l-yellow-500";

  return (
    <article className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${accent} shadow-sm hover:shadow-md transition flex flex-col`}>
      <header className="p-5 pb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">{fee.month}</h3>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {fee.studentId?.name || "Student"}
            {fee.studentId?.rollNo ? ` · ${fee.studentId.rollNo}` : ""}
          </p>
          <p className="text-[11px] font-mono text-gray-400 mt-1">{fee.invoiceNo}</p>
        </div>
        <PaymentStatusBadge status={fee.status} />
      </header>

      <div className="px-5 pb-4">
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(fee.amount)}</div>
      </div>

      <dl className="px-5 pb-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4">
        <div>
          <dt className="text-[11px] uppercase text-gray-400">Due</dt>
          <dd className="text-gray-800 font-medium mt-0.5">{formatDate(fee.dueDate)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase text-gray-400">Paid</dt>
          <dd className="text-gray-800 font-medium mt-0.5">{formatDate(fee.paidDate)}</dd>
        </div>
      </dl>

      <div className="px-5 pb-5 mt-auto flex gap-2">
        {fee.status !== "paid" && onPay && (
          <button onClick={() => onPay(fee)} className="flex-1 bg-blue-600 text-white font-semibold rounded-xl px-4 py-2 text-sm hover:bg-blue-700 transition">
            Mark Paid
          </button>
        )}
        {onViewReceipt && (
          <button onClick={() => onViewReceipt(fee)} className={`font-semibold rounded-xl px-4 py-2 text-sm bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition ${fee.status === "paid" ? "flex-1" : ""}`}>
            Receipt
          </button>
        )}
      </div>
    </article>
  );
}