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

  useEffect(() => {
    if (isOpen) { setMethod("cash"); setTxnId(""); setSubmitting(false); }
  }, [isOpen]);

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
    try {
      await onConfirm?.({ paymentMethod: method, transactionId: txnId || undefined });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
          <h3 className="font-poppins font-semibold text-lg text-navy-900">Record Payment</h3>
          <button onClick={onClose} className="text-navy-400 hover:text-navy text-2xl leading-none" aria-label="Close">×</button>
        </header>

        <div className="p-6 space-y-5">
          <div className="bg-navy-50 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-navy-500">Invoice</span>
              <span className="font-mono text-navy-900">{fee.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-500">Student</span>
              <span className="text-navy-900">{fee.studentId?.name || "—"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-navy-200 mt-2">
              <span className="font-semibold text-navy-700">Amount</span>
              <span className="font-poppins font-bold text-lg text-navy-900">{formatCurrency(fee.amount)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map(({ value, label, icon }) => {
                const active = method === value;
                return (
                  <button key={value} type="button" onClick={() => setMethod(value)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 transition ${active ? "border-brand bg-brand-50" : "border-navy-100 hover:border-navy-200"}`}>
                    <span className="text-xl">{icon}</span>
                    <span className={`text-[11px] font-medium ${active ? "text-brand-700" : "text-navy-600"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">
              Transaction ID <span className="text-navy-400 font-normal normal-case">(optional)</span>
            </label>
            <input type="text" placeholder="e.g. TXN-9821" value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-200 focus:border-brand outline-none transition" />
          </div>

          <p className="text-xs text-navy-400 text-center">
            A PDF receipt will be available immediately after payment.
          </p>
        </div>

        <footer className="flex gap-3 px-6 py-4 border-t border-navy-100">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-navy-200 text-navy-700 font-medium text-sm hover:bg-navy-50 transition">
            Cancel
          </button>
          <button onClick={submit} disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-600 disabled:opacity-50 transition shadow-sm shadow-brand/30">
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {submitting ? "Processing…" : "Confirm Payment"}
          </button>
        </footer>
      </div>
    </div>
  );
}