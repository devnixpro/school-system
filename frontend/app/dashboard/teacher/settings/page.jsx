"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Bell, Palette, ShieldCheck, Save, Loader2 } from "lucide-react";
import api from "@/services/api"; // Aap ka axios instance

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    assignmentSubmissions: true,
    studentMessages: true,
  });

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    teacherId: "",
    department: "",
    bio: "",
  });

  const sidebarNavItems = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "security", label: "Security & Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance & Theme", icon: Palette },
    { id: "privacy", label: "Privacy & Data", icon: ShieldCheck },
  ];

  // Fetch Teacher Settings & Profile from Backend on Page Load
  useEffect(() => {
    const fetchTeacherSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Teacher settings endpoint
        const response = await api.get("/teacher/settings");
        const data = response?.data || response;

        if (data?.profile) setProfile(data.profile);
        if (data?.notifications) setNotifications(data.notifications);
      } catch (err) {
        console.error("Failed to fetch teacher settings:", err);
        setError("Failed to load settings data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherSettings();
  }, []);

  // Save Changes to Backend API
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        profile,
        notifications,
      };

      // Teacher settings update endpoint
      await api.put("/teacher/settings", payload);
      
      alert("Teacher settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading Screen jab data fetch ho raha ho
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Account Settings</h1>
          <p className="text-sm text-slate-500">
            Manage your faculty profile, teaching notification preferences, and security settings.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md shadow-sky-600/20 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message Display if Fetch Fails */}
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-600 text-xs">
          {error}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-sky-50 text-sky-600 border border-sky-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* 1. Profile Settings */}
          {activeTab === "profile" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Faculty Profile Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Teacher ID</label>
                  <input
                    type="text"
                    disabled
                    value={profile.teacherId}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-xl px-3.5 py-2.5 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Department / Expertise</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Bio / Teaching Statement</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3.5 outline-none focus:border-sky-500 transition resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Notification Preferences
              </h2>
              
              <div className="space-y-3">
                {Object.keys(notifications).map((key) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-xs font-semibold text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                      className="w-4 h-4 text-sky-600 accent-sky-600 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Security Settings */}
          {activeTab === "security" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Security & Password
              </h2>
              <p className="text-xs text-slate-500">Update your account password regularly to keep your account secure.</p>
              
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500" />
                </div>
              </div>
            </div>
          )}

          {/* 4. Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Appearance & Theme
              </h2>
              <p className="text-xs text-slate-500">Customize how your teacher portal looks on your device.</p>
              
              <div className="flex gap-4 pt-2">
                <div className="border border-sky-600 bg-sky-50/50 p-4 rounded-xl flex-1 text-center cursor-pointer">
                  <p className="text-xs font-bold text-sky-700">Light Theme</p>
                </div>
                <div className="border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex-1 text-center cursor-pointer opacity-60">
                  <p className="text-xs font-bold text-slate-600">Dark Theme (Coming Soon)</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-slate-500 text-xs">
              Privacy configuration options and data export tools will appear here.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}