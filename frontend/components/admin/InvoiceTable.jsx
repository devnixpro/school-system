"use client";
import PaymentStatusBadge from "@/components/common/PaymentStatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function InvoiceTable({ fees = [], onPay, onViewReceipt, onDelete }) {
  if (!fees.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <div className="text-6xl mb-4">🧾</div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1">No invoices yet</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">Generate your first batch of fee invoices to see them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Invoice", "Student", "Month", "Amount", "Due", "Status", "Actions"].map((h, i) => (
                <th key={h} className={`px-5 py-3 font-semibold text-[11px] uppercase text-gray-500 ${i === 3 || i === 6 ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fees.map((fee) => (
              <tr key={fee._id} className="hover:bg-gray-50">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{fee.invoiceNo}</td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-gray-900">{fee.studentId?.name || "—"}</div>
                  {fee.studentId?.rollNo && <div className="text-[11px] text-gray-400">{fee.studentId.rollNo}</div>}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{fee.month}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{formatCurrency(fee.amount)}</td>
                <td className="px-5 py-3.5 text-gray-600">{formatDate(fee.dueDate)}</td>
                <td className="px-5 py-3.5"><PaymentStatusBadge status={fee.status} size="sm" /></td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {onViewReceipt && (
                      <button onClick={() => onViewReceipt(fee)} className="text-gray-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-gray-100 text-xs font-medium">Receipt</button>
                    )}
                    {fee.status !== "paid" && onPay && (
                      <button onClick={() => onPay(fee)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-xs font-semibold">Pay</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(fee)} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-medium">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}