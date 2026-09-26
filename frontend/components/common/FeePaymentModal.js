"use client";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

const METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "online", label: "Online", icon: "🌐" },
  { value: "cheque", label: "Cheque", icon: "📄" },
];

export default function FeePaymentModal({ isOpen, onClose, fee, onConfirm }) {
  const [method, setMethod] = useState("cash");
  const [txnId, setTxnId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (isOpen) { setMethod("cash"); setTxnId(""); setSubmitting(false); } }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fee) return null;

  const submit = async () => {
    setSubmitting(true);
    try { await onConfirm?.({ paymentMethod: method, transactionId: txnId || undefined }); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg">Record Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none" aria-label="Close">×</button>
        </header>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-gray-500">Invoice</span><span className="font-mono">{fee.invoiceNo}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Student</span><span>{fee.studentId?.name || "—"}</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="font-semibold">Amount</span>
              <span className="font-bold text-lg">{formatCurrency(fee.amount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map(({ value, label, icon }) => {
                const active = method === value;
                return (
                  <button key={value} type="button" onClick={() => setMethod(value)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition ${active ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}>
                    <span className="text-xl">{icon}</span>
                    <span className={`text-[11px] font-medium ${active ? "text-blue-700" : "text-gray-600"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Transaction ID (optional)</label>
            <input type="text" placeholder="TXN-9821" value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
          </div>

          <p className="text-xs text-gray-400 text-center">A PDF receipt will be available immediately after payment.</p>
        </div>

        <footer className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={submit} disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50">
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {submitting ? "Processing…" : "Confirm Payment"}
          </button>
        </footer>
      </div>
    </div>
  );
}