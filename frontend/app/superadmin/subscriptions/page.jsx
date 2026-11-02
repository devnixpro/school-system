"use client";

import { useState, useEffect } from "react";

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("Plans");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/superadmin/subscriptions", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "Failed to fetch subscriptions");
        setSubscriptions(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading subscriptions...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage subscription plans and view billing history</p>
      </div>

      {/* Stats Cards (Real Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Subscriptions</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{subscriptions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {subscriptions.filter(sub => sub.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Pending Subscriptions</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {subscriptions.filter(sub => sub.status === 'inactive' || sub.status === 'expired').length}
          </p>
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
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "Plans" && (
             <div className="text-center py-10 text-gray-500">
                {subscriptions.length === 0 ? "No subscriptions found in database." : "Subscriptions list will appear here."}
             </div>
          )}
          {activeTab === "Transactions" && (
             <div className="text-center py-10 text-gray-500">Transactions data will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
}