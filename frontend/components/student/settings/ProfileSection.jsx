"use client";

import React from "react";

export default function ProfileSection({ profile, setProfile }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-[#0B1E36]">Personal Details</h2>
        <p className="text-xs text-slate-500">Update your student information and profile details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Phone Number</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Student ID (Read-only)</label>
          <input
            type="text"
            disabled
            value={profile.studentId}
            className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-2">Bio / Description</label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}