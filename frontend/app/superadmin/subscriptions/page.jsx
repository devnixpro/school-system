"use client";

import { useState } from "react";

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("Plans");

  const plans = [
    {
      name: "Basic",
      price: "Rs. 5,000",
      period: "/month",
      color: "gray",
      features: [
        "Up to 200 students",
        "Basic attendance tracking",
        "Fee management",
        "Email support",
      ],
      subscribers: 84,
    },
    {
      name: "Standard",
      price: "Rs. 12,000",
      period: "/month",
      color: "blue",
      features: [
        "Up to 800 students",
        "Biometric attendance",
        "Exam & results module",
        "SMS notifications",
        "Priority support",
      ],
      subscribers: 112,
    },
    {
      name: "Premium",
      price: "Rs. 25,000",
      period: "/month",
      color: "purple",
      features: [
        "Unlimited students",
        "All features included",
        "Parent mobile app",
        "Custom branding",
        "24/7 dedicated support",
        "Advanced analytics",
      ],
      subscribers: 52,
    },
  ];

  const recentTransactions = [
    { id: "#TXN-4821", school: "Lahore Model School", plan: "Premium", amount: "Rs. 25,000", status: "Paid", date: "Oct 15, 2026" },
    { id: "#TXN-4820", school: "Karachi Academy", plan: "Standard", amount: "Rs. 12,000", status: "Paid", date: "Oct 14, 2026" },
    { id: "#TXN-4819", school: "Islamabad Grammar", plan: "Premium", amount: "Rs. 25,000", status: "Pending", date: "Oct 14, 2026" },
    { id: "#TXN-4818", school: "Punjab Public School", plan: "Basic", amount: "Rs. 5,000", status: "Paid", date: "Oct 13, 2026" },
    { id: "#TXN-4817", school: "Sindh Model High", plan: "Standard", amount: "Rs. 12,000", status: "Failed", date: "Oct 13, 2026" },
  ];

  const getPlanColor = (color) => {
    if (color === "purple") return "border-purple-300 bg-purple-50";
    if (color === "blue") return "border-blue-300 bg-blue-50";
    return "border-gray-300 bg-gray-50";
  };

  const getStatusColor = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Failed") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage subscription plans and view billing history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">Rs. 2.8M</p>
          <span className="text-xs font-medium text-green-600 mt-2 inline-block">
            ↑ +18% from last month
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">248</p>
          <span className="text-xs font-medium text-green-600 mt-2 inline-block">
            ↑ +12 new this month
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Churn Rate</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">2.4%</p>
          <span className="text-xs font-medium text-red-600 mt-2 inline-block">
            ↓ -0.5% from last month
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {["Plans", "Transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Plans Tab */}
          {activeTab === "Plans" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`border-2 rounded-xl p-6 ${getPlanColor(plan.color)}`}
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-3xl font-bold text-gray-800">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500 mb-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {plan.subscribers} active subscribers
                  </p>
                  <ul className="mt-5 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-green-600 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition text-sm">
                    Edit Plan
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "Transactions" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Transaction ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      School
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Plan
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">
                        {txn.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {txn.school}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {txn.plan}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">
                        {txn.amount}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                            txn.status
                          )}`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {txn.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}