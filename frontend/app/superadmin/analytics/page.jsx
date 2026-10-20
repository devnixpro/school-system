"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const stats = [
    { label: "Total Revenue", value: "Rs. 4.2M", change: "+23%", color: "text-green-600" },
    { label: "New Schools", value: "42", change: "+18%", color: "text-green-600" },
    { label: "Active Users", value: "12,456", change: "+8%", color: "text-green-600" },
    { label: "Avg. Session", value: "24 min", change: "-3%", color: "text-red-600" },
  ];

  const monthlyData = [
    { month: "May", schools: 180, revenue: 2.1 },
    { month: "Jun", schools: 195, revenue: 2.4 },
    { month: "Jul", schools: 210, revenue: 2.8 },
    { month: "Aug", schools: 220, revenue: 3.2 },
    { month: "Sep", schools: 235, revenue: 3.8 },
    { month: "Oct", schools: 248, revenue: 4.2 },
  ];

  const topCities = [
    { city: "Lahore", schools: 78, percentage: 31 },
    { city: "Karachi", schools: 62, percentage: 25 },
    { city: "Islamabad", schools: 45, percentage: 18 },
    { city: "Faisalabad", schools: 32, percentage: 13 },
    { city: "Rawalpindi", schools: 31, percentage: 13 },
  ];

  const planDistribution = [
    { plan: "Premium", count: 52, percentage: 21, color: "bg-purple-500" },
    { plan: "Standard", count: 112, percentage: 45, color: "bg-blue-500" },
    { plan: "Basic", count: 84, percentage: 34, color: "bg-gray-500" },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform performance and growth insights
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white text-sm"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            <p className={`text-xs font-medium mt-2 ${stat.color}`}>
              {stat.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Revenue Growth (Millions PKR)
        </h2>
        <div className="flex items-end justify-between gap-4" style={{ height: "260px" }}>
          {monthlyData.map((data) => {
            const heightPx = (data.revenue / maxRevenue) * 220;
            return (
              <div
                key={data.month}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                <span className="text-xs font-medium text-gray-700 mb-2">
                  {data.revenue}M
                </span>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all"
                  style={{ height: `${heightPx}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Cities by Schools
          </h2>
          <div className="space-y-4">
            {topCities.map((item) => (
              <div key={item.city}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    {item.city}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.schools} schools ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Plan Distribution
          </h2>
          <div className="space-y-4">
            {planDistribution.map((item) => (
              <div key={item.plan} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.plan}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {item.count} schools
                  </span>
                  <span className="text-sm font-semibold text-gray-800 w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Subscriptions</span>
              <span className="font-semibold text-gray-800">248</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">Monthly Recurring Revenue</span>
              <span className="font-semibold text-gray-800">Rs. 2.8M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Platform Activity
        </h2>
        <div className="space-y-4">
          {[
            { action: "New school registered", detail: "The Core Montessori, Lahore", time: "2 mins ago", icon: "🏫" },
            { action: "Subscription upgraded", detail: "Karachi Academy → Premium", time: "1 hour ago", icon: "⬆️" },
            { action: "Payment received", detail: "Rs. 12,000 from Punjab Public School", time: "3 hours ago", icon: "💰" },
            { action: "New school registered", detail: "Sindh Model High, Hyderabad", time: "5 hours ago", icon: "🏫" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}