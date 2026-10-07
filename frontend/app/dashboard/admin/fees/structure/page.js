"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FeeStructureForm from "@/components/admin/FeeStructureForm";
import api from "@/services/api";
import { feeService } from "@/services/feeService";
import { IconArrowLeft, IconCheckCircle } from "@/components/common/FeeIcons";

export default function FeeStructurePage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/students?limit=200", { timeout: 3000 })
      .then((res) => setStudents(res.data?.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (payload) => {
    setError(null);
    try {
      const res = await feeService.bulkCreate(payload);
      setRecent(res.data || []);
      if (confirm(`✅ ${res.count} invoices created.\n\nView them now?`)) {
        router.push("/dashboard/admin/fees/invoices");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create invoices";
      setError(msg);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/dashboard/admin/fees"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
        >
          <IconArrowLeft /> Fee Management
        </Link>

        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-gray-900 tracking-tight">
            Generate invoices
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            Select students and set the amount and due date. Invoices are created instantly.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8">
          <FeeStructureForm students={students} onSubmit={submit} loading={loading} />
        </div>

        {recent.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IconCheckCircle size={18} />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">
                  {recent.length} invoice{recent.length !== 1 ? "s" : ""} created
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Just now</p>
              </div>
            </div>

            <ul className="divide-y divide-gray-50">
              {recent.slice(0, 5).map((fee) => (
                <li key={fee._id} className="px-6 py-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500">{fee.invoiceNo}</span>
                  <span className="text-sm font-medium text-gray-900 tabular-nums">
                    PKR {Number(fee.amount).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {recent.length > 5 && (
              <div className="px-6 py-3 text-xs text-gray-500 bg-gray-50/50">
                + {recent.length - 5} more
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 bg-gray-50/50">
              <Link
                href="/dashboard/admin/fees/invoices"
                className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                View invoices
              </Link>
              <button
                onClick={() => setRecent([])}
                className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Create more
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}