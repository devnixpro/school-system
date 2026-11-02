'use client';
import WelcomeBanner from '@/components/admin/dashboard/WelcomeBanner';
import Link from "next/link";
import React from 'react'

export default function TeacherDashboard() {
  
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-800 p-2 md:p-6 space-y-6">
      <WelcomeBanner />
    </div>
  );
}