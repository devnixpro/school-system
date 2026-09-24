"use client";
import { useEffect, useState, useCallback } from "react";
import InvoiceTable from "@/components/admin/InvoiceTable";
import FeePaymentModal from "@/components/common/FeePaymentModal";
import { feeService } from "@/services/feeService";

export default function InvoicesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    feeService.list({ status, limit: 100 })
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const handlePay = async (payload) => {
    try { await feeService.markPaid(selected._id, payload); setSelected(null); load(); }
    catch (err) { alert(err.response?.data?.message || "Failed"); }
  };

  const handleReceipt = (fee) => window.open(feeService.receiptUrl(fee._id), "_blank");

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Every fee record for your school.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </header>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">Loading…</div>
      ) : (
        <InvoiceTable fees={fees} onPay={setSelected} onViewReceipt={handleReceipt} />
      )}

      <FeePaymentModal isOpen={!!selected} onClose={() => setSelected(null)} fee={selected} onConfirm={handlePay} />
    </main>
  );
}