"use client";

import React, { useState, useEffect } from "react";
import { noticeService } from "@/services/noticeService";
import { 
  Megaphone, 
  Calendar, 
  User, 
  Search, 
  Loader2, 
  AlertCircle, 
  BellRing,
  AlertTriangle,
  Info
} from "lucide-react";

export default function NoticeboardPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetching notices from API
  useEffect(() => {
    async function fetchNotices() {
      try {
        setLoading(true);
        setError(null);
        // Student dashboard ke liye 'Students' target audience pass ki gayi hai
        const data = await noticeService.getNotices("Students");
        const noticesArray = Array.isArray(data) ? data : (data.data || []);
        setNotices(noticesArray);
      } catch (err) {
        setError(err.message || "Could not load noticeboard updates.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  // Filter and Search logic based on actual backend keys
  const filteredNotices = notices.filter((notice) => {
    const matchesPriority = selectedPriority === "all" || notice.priority?.toLowerCase() === selectedPriority.toLowerCase();
    const matchesSearch = notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  // Priority Badge Color Helper
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-blue-50 text-[#1B63E0] border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-800 p-4 md:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1E36] flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-[#1B63E0]" /> School Noticeboard
          </h1>
          <p className="text-sm text-slate-500">
            Stay updated with official announcements, circulars, and school events.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition shadow-sm"
          />
        </div>
      </div>

      {/* Priority Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {["all", "high", "medium", "low"].map((priority) => (
          <button
            key={priority}
            onClick={() => setSelectedPriority(priority)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
              selectedPriority === priority
                ? "bg-[#0B1E36] text-white shadow-md shadow-slate-900/10"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {priority} Priority
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader2 className="w-10 h-10 text-[#1B63E0] animate-spin mb-3" />
          <p className="text-sm font-semibold text-[#0B1E36]">Loading announcements...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Error Loading Noticeboard</h4>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Notices Feed */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div 
                key={notice._id} 
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  notice.priority === 'High' ? 'bg-red-500' : notice.priority === 'Medium' ? 'bg-amber-500' : 'bg-[#1B63E0]'
                }`}></div>

                <div>
                  {/* Priority & Date Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border tracking-wide ${getPriorityBadge(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-[#0B1E36] mb-2 group-hover:text-[#1B63E0] transition">
                    {notice.title}
                  </h3>

                  {/* Content */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {notice.content}
                  </p>
                </div>

                {/* Footer Meta (PostedBy & Target Audience) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{notice.postedBy}</span>
                  </div>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600">
                    {notice.targetAudience}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
              <BellRing className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0B1E36]">No Notices Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                There are no active notices matching your filter criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}