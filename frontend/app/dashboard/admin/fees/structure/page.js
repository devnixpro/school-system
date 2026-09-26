"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FeeStructureForm from "@/components/admin/FeeStructureForm";
import api from "@/services/api";
import { feeService } from "@/services/feeService";

export default function FeeStructurePage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get("/students?limit=200")
      .then((res) => setStudents(res.data?.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (payload) => {
    try {
      const res = await feeService.bulkCreate(payload);
      setRecent(res.data || []);
      if (confirm(`${res.count} invoices created! View them now?`)) router.push("/dashboard/admin/fees/invoices");
    } catch (err) { alert(err.response?.data?.message || "Failed to create invoices"); }
  };

  return (
    <main className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Generate Fee Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">Select students, set an amount and due date ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â invoices are created instantly.</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <FeeStructureForm students={students} onSubmit={submit} loading={loading} />
      </div>

      {recent.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Just Created ({recent.length})</h3>
          <ul className="text-sm divide-y divide-gray-100">
            {recent.slice(0, 5).map((fee) => (
              <li key={fee._id} className="py-2 flex justify-between">
                <span className="font-mono text-xs text-gray-500">{fee.invoiceNo}</span>
                <span className="text-gray-700 font-medium">PKR {Number(fee.amount).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}