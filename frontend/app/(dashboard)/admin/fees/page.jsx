"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MonthlyCollectionChart from "@/components/admin/MonthlyCollectionChart";
import FeeTypeSummaryTable from "@/components/admin/FeeTypeSummaryTable";
import feeService from "@/services/feeService";

export default function AdminFeesPage() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [summary, setSummary] = useState({ totalCollected: 0, totalPending: 0, defaulters: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all 3 endpoints in parallel
        const [monthlyRes, typeRes, summaryRes] = await Promise.all([
          feeService.getMonthlyAnalytics().catch(() => ({ data: [] })),
          feeService.getByTypeAnalytics().catch(() => ({ data: [] })),
          feeService.getAnalytics().catch(() => ({ data: {} }))
        ]);
        
        setMonthlyData(monthlyRes?.data || []);
        setTypeData(typeRes?.data || []);
        setSummary(summaryRes?.data || {});
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard/admin" className="text-sm text-gray-500 hover:text-brand mb-2 inline-flex items-center gap-2 transition">← Back to Dashboard</Link>
            <h1 className="text-3xl font-semibold text-navy tracking-tight">Fee Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your school's fee collection and analytics.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/fees/invoices" className="bg-white border border-gray-200 text-navy px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">View Invoices</Link>
            <Link href="/admin/fees/structure" className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition shadow-sm shadow-brand/20">+ Generate Invoice</Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Collected</p>
            <h3 className="text-2xl font-semibold text-navy mt-2">Rs. {summary?.totalCollected?.toLocaleString() || 0}</h3>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Outstanding Fees</p>
            <h3 className="text-2xl font-semibold text-navy mt-2">Rs. {summary?.totalPending?.toLocaleString() || 0}</h3>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Fee Defaulters</p>
            <h3 className="text-2xl font-semibold text-navy mt-2">{summary?.defaulters || 0} Students</h3>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-gray-200/60">Loading chart...</div>
          ) : (
            <MonthlyCollectionChart data={monthlyData} />
          )}
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-gray-200/60">Loading summary...</div>
          ) : (
            <FeeTypeSummaryTable data={typeData} />
          )}
        </div>

      </div>
    </main>
  );
}