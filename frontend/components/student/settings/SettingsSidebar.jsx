"use client";

import React from "react";
import { Camera, ChevronRight, Headphones } from "lucide-react";

export default function SettingsSidebar({ profile, sidebarNavItems, activeTab, setActiveTab }) {
  return (
    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
      {/* User Brief Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop"
            alt={profile.fullName}
            className="w-full h-full object-cover rounded-full border-4 border-[#1B63E0]/10"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-[#1B63E0] text-white rounded-full hover:bg-blue-700 shadow-sm transition">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="font-bold text-lg text-[#0B1E36]">{profile.fullName}</h3>
        <p className="text-xs font-semibold text-[#1B63E0] bg-blue-50 px-3 py-1 rounded-full inline-block mt-1">
          Student • {profile.class}
        </p>
        <p className="text-xs text-slate-400 mt-2">ID: {profile.studentId}</p>
      </div>

      {/* Settings Nav Menu */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-1">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-[#1B63E0] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-300"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}