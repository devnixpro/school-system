"use client";

import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/superadmin/analytics", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "Failed to fetch analytics");
        
        setAnalytics(data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading Analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Platform performance and growth insights</p>
      </div>

      {/* Stats Cards (Real Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Schools</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{analytics?.totalSchools || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Subscriptions</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{analytics?.totalSubscriptions || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{analytics?.totalUsers || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">Rs. {analytics?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <p className="text-gray-500">
          Revenue Charts and Top Cities data will appear here once backend provides historical data.
        </p>
      </div>
    </div>
  );
}