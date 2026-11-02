"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function MonthlyCollectionChart({ data }) {
  // Agar data null hai toh khali array bana dein
  const chartData = data || [];

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200/60 p-6">
        No collection data available
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-navy text-lg flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center text-sm">📈</span>
          Monthly Fee Collection
        </h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none">
          <option>Last 6 Months</option>
        </select>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={(v) => `${v / 1000000}M`} />
            <Tooltip cursor={{ fill: "#f3f4f6" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Collected"]} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => <Cell key={index} fill="#0077F5" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}