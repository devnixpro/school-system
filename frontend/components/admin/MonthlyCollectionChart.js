"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/utils/formatCurrency";

// Mock data — replace with real API later
const MOCK_DATA = [
  { month: "Jan", amount: 1700000 },
  { month: "Feb", amount: 2300000 },
  { month: "Mar", amount: 2800000 },
  { month: "Apr", amount: 3100000 },
  { month: "May", amount: 3500000 },
  { month: "Jun", amount: 4200000 },
];

const RANGES = ["Last 6 Months", "Last 12 Months", "This Year"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg">
      Rs. {(payload[0].value / 1000000).toFixed(1)}M
    </div>
  );
}

export default function MonthlyCollectionChart({ data }) {
  const [range, setRange] = useState(RANGES[0]);
  const chartData = data || MOCK_DATA;
  const maxMonth = chartData.reduce((a, b) => (b.amount > a.amount ? b : a), chartData[0]);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="font-semibold text-gray-900">Monthly Fee Collection</h3>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-600"
        >
          {RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </header>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(v) => `${v / 1000000}M`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.month === maxMonth.month ? "#2563eb" : "#93c5fd"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}