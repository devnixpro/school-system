"use client";

import React, { useState } from "react";
import { User, Lock, Bell, Palette, ShieldCheck, Save } from "lucide-react";
import SettingsSidebar from "@/components/student/settings/SettingsSidebar";
import ProfileSection from "@/components/student/settings/ProfileSection";
import NotificationsSection from "@/components/student/settings/NotificationsSection";
import { SecuritySection, AppearanceSection } from "@/components/student/settings/SecurityApparanceSection";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    assignmentUpdates: true,
    gradeAlerts: true,
  });

  const [profile, setProfile] = useState({
    fullName: "Zoya Ali",
    email: "zoya.ali@devnixedu.com",
    phone: "+92 300 1234567",
    studentId: "STU-2025-0892",
    class: "Class 6-A",
    bio: "Passionate about Mathematics and Computer Science.",
  });

  const sidebarNavItems = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "security", label: "Security & Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance & Theme", icon: Palette },
    { id: "privacy", label: "Privacy & Data", icon: ShieldCheck },
  ];

  const handleSave = () => {
    // API Call logic
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-800 p-4 md:p-6 font-sans">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E36]">Account Settings</h1>
          <p className="text-sm text-slate-500">
            Manage your personal profile, notification preferences, and security settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#1B63E0] hover:bg-[#1552BD] rounded-xl shadow-md shadow-blue-500/20 transition"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <SettingsSidebar 
          profile={profile} 
          sidebarNavItems={sidebarNavItems} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Dynamic Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {activeTab === "profile" && (
            <ProfileSection profile={profile} setProfile={setProfile} />
          )}

          {activeTab === "notifications" && (
            <NotificationsSection notifications={notifications} setNotifications={setNotifications} />
          )}

          {activeTab === "security" && <SecuritySection />}

          {activeTab === "appearance" && <AppearanceSection />}

          {activeTab === "privacy" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-500 text-sm">
              Privacy settings coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}