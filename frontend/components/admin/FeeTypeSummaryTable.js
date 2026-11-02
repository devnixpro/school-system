"use client";

import { formatCurrency } from "@/utils/formatCurrency";

// Mock data — replace with real API later
const RANGES = ["This Month", "Last Month", "This Year"];

function ProgressBar({ value, tone = "blue" }) {
  const color = tone === "blue" ? "bg-blue-500" : "bg-gray-300";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function FeeTypeSummaryTable({ rows }) {
  const data = Array.isArray(rows) ? rows : [];
  const totalAmount = data.reduce((s, r) => s + r.amount, 0);
  const avgCollection = data.length ? Math.round(data.reduce((s, r) => s + r.collection, 0) / data.length) : 0;
  const avgPending = 100 - avgCollection;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📘</span>
          <h3 className="font-semibold text-gray-900">Fee Collection Summary</h3>
        </div>
        <select className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-600">
          {RANGES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 font-medium text-gray-500">Fee Type</th>
              <th className="text-right py-2 font-medium text-gray-500">Amount (Rs.)</th>
              <th className="text-center py-2 font-medium text-gray-500">Collection</th>
              <th className="text-center py-2 font-medium text-gray-500">Pending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">No fee records available yet.</td></tr>}
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/60">
                <td className="py-3 font-medium text-gray-800">{row.type}</td>
                <td className="py-3 text-right tabular-nums text-gray-700">
                  {row.amount.toLocaleString("en-US")}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                      {row.collection}%
                    </span>
                    <ProgressBar value={row.collection} tone="blue" />
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs font-semibold text-gray-500 w-10 text-right">
                      {row.pending}%
                    </span>
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                  </div>
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-100 font-semibold text-gray-900">
              <td className="py-3">Total</td>
              <td className="py-3 text-right tabular-nums">
                {totalAmount.toLocaleString("en-US")}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold w-10 text-right">{avgCollection}%</span>
                  <ProgressBar value={avgCollection} tone="blue" />
                </div>
              </td>
              <td className="py-3 text-right text-xs">{avgPending}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}