"use client";

import React from "react";

export default function NotificationsSection({ notifications, setNotifications }) {
  const items = [
    { id: "emailAlerts", title: "Email Notifications", desc: "Receive weekly summaries and important system updates." },
    { id: "smsAlerts", title: "SMS Alerts", desc: "Get urgent reminders for exams and attendance alerts." },
    { id: "assignmentUpdates", title: "Assignment Notifications", desc: "Alerts when new homework or projects are assigned." },
    { id: "gradeAlerts", title: "Grade & Result Updates", desc: "Instant updates when teachers post exam grades." },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-[#0B1E36]">Notification Preferences</h2>
        <p className="text-xs text-slate-500">Choose how and when you want to receive alerts.</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-[#0B1E36]">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[item.id]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [item.id]: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B63E0]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}