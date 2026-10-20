"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

const METHODS = [
  { value: "cash", label: "Cash", icon: "" },
  { value: "card", label: "Card", icon: "" },
  { value: "bank_transfer", label: "Bank transfer", icon: "" },
  { value: "online", label: "Online", icon: "" },
  { value: "cheque", label: "Cheque", icon: "" },
];

export default function FeePaymentModal({ isOpen, onClose, fee, onConfirm }) {
  const [method, setMethod] = useState("cash");
  const [txnId, setTxnId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMethod("cash");
      setTxnId("");
      setSubmitting(false);
      // Focus first interactive element for a11y
      setTimeout(() => {
        modalRef.current?.querySelector("button")?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fee) return null;

  const submit = async () => {
    setSubmitting(true);
    try {
      await onConfirm?.({
        paymentMethod: method,
        transactionId: txnId.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3
            id="payment-modal-title"
            className="font-semibold text-navy text-[17px] tracking-tight"
          >
            Record payment
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-navy text-2xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded"
            aria-label="Close dialog"
          >
            
          </button>
        </header>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice</span>
              <span className="font-mono text-navy text-[13px]">
                {fee.invoiceNo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Student</span>
              <span className="text-navy">
                {fee.studentId?.name || ""}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="font-medium text-gray-700">Amount</span>
              <span className="font-semibold text-navy text-[15px] tabular-nums">
                {formatCurrency(fee.amount)}
              </span>
            </div>
          </div>

          <fieldset>
            <legend className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-2">
              Payment method
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map(({ value, label, icon }) => {
                const active = method === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMethod(value)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1 rounded-lg border py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 ${
                      active
                        ? "border-navy bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {icon}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        active ? "text-navy" : "text-gray-600"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="txn-id"
              className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1.5"
            >
              Transaction ID{" "}
              <span className="text-gray-400 font-normal normal-case">
                (optional)
              </span>
            </label>
            <input
              id="txn-id"
              type="text"
              placeholder="TXN-9821"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 transition"
            />
          </div>

          <p className="text-xs text-gray-400 text-center">
            A PDF receipt will be available immediately after payment.
          </p>
        </div>

        <footer className="flex gap-3 px-6 py-5 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition"
          >
            {submitting && (
              <span
                className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"
                aria-hidden="true"
              />
            )}
            {submitting ? "Processing" : "Confirm payment"}
          </button>
        </footer>
      </div>
    </div>
  );
}