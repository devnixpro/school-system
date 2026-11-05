"use client";

import { useState, useEffect } from "react";

export default function SuperAdminDashboard() {
  // Backend data ke liye states
  const [stats, setStats] = useState([]);
  const [recentSchools, setRecentSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Login ke waqt token save hua tha
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        // Backend API call
        const response = await fetch("http://localhost:5000/api/superadmin/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Token bhejna zaroori hai
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch dashboard data");
        }

        // Backend se aaye data ko UI ke hisaab se set karna
        // (Agar backend team alag structure bhej rahi hai, toh yahan thora change hoga)
        setStats([
          { label: "Total Schools", value: data.totalSchools || "0", change: "+0%" },
          { label: "Active Subscriptions", value: data.activeSubscriptions || "0", change: "+0%" },
          { label: "Total Revenue", value: data.totalRevenue || "Rs. 0", change: "+0%" },
          { label: "Pending Requests", value: data.pendingRequests || "0", change: "0%" },
        ]);

        setRecentSchools(data.recentSchools || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Expired") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // Loading State
  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Loading dashboard data...</div>;
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-200">
          <strong>Error:</strong> {error}
          <br />
          <span className="text-sm mt-2 block">Make sure backend is running and you are logged in.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome back, Super Admin! 👋</h1>
        <p className="text-blue-100 mt-2">
          Here's what's happening with your platform today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith("+")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Recently Registered Schools
          </h2>
          <button className="text-sm text-blue-600 hover:underline font-medium">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  School Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Plan
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSchools.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No recent schools found in database.
                  </td>
                </tr>
              ) : (
                recentSchools.map((school, idx) => (
                  <tr key={school._id || idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {school.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {school.plan}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                          school.status
                        )}`}
                      >
                        {school.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {school.createdAt ? new Date(school.createdAt).toLocaleDateString() : "Just now"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition">
          <div className="text-3xl mb-3">🏫</div>
          <h3 className="font-semibold text-gray-800">Add New School</h3>
          <p className="text-sm text-gray-500 mt-1">
            Register a new school to the platform
          </p>
        </button>

        <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition">
          <div className="text-3xl mb-3">💳</div>
          <h3 className="font-semibold text-gray-800">Manage Subscriptions</h3>
          <p className="text-sm text-gray-500 mt-1">
            View and update subscription plans
          </p>
        </button>

        <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="font-semibold text-gray-800">View Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">
            Check platform performance reports
          </p>
        </button>
      </div>
    </div>
  );
}