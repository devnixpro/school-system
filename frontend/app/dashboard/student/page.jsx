"use client";
import React from 'react';
import WelcomeBanner from '@/components/student/dashboard/WelcomeBanner';
import MetricCards from '@/components/student/dashboard/MetricCards';
import AnalyticsCharts from '@/components/student/dashboard/AnalyticsCharts';
import ClassScheduleTable from '@/components/student/dashboard/ClassScheduleTable';
import HomeworkSubmissionsTable from '@/components/student/dashboard/HomeworkSubmissionsTable';
import QuickActions from '@/components/student/dashboard/QuickActions';
import UpcomingEvents from '@/components/student/dashboard/UpcomingEvents';
import RecentActivity from '@/components/student/dashboard/RecentActivity';

export default function StudentDashboard() {
  
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-800 p-2 md:p-6 space-y-6">
      <WelcomeBanner />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <MetricCards />
          <AnalyticsCharts />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ClassScheduleTable />
            <HomeworkSubmissionsTable />
          </div>
        </div>
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <QuickActions />
          <UpcomingEvents />
          <RecentActivity />
        </div>

      </div>
    </div>
  );
}