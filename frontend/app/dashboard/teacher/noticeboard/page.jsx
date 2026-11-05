"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { 
  Megaphone, 
  Calendar, 
  User, 
  Search, 
  Loader2, 
  AlertCircle, 
  BellRing,
  Plus,
  X
} from "lucide-react";

export default function TeacherNoticeboardPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Create Notice State
  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    targetAudience: "Students",
    priority: "Medium"
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetching Notices for Teachers
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/notices", {
        params: { targetAudience: "Teachers" }
      });
      const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setNotices(dataArray);
    } catch (err) {
      console.error("Error fetching notices:", err);
      setError(err.response?.data?.message || "Could not load noticeboard updates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle Create Notice Form Submit
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/notices", newNotice);
      setShowModal(false);
      setNewNotice({ title: "", content: "", targetAudience: "Students", priority: "Medium" });
      fetchNotices(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post notice.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and Search
  const filteredNotices = notices.filter((notice) => {
    const matchesPriority = selectedPriority === "all" || notice.priority?.toLowerCase() === selectedPriority.toLowerCase();
    const matchesSearch = notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

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
            <Megaphone className="w-7 h-7 text-[#1B63E0]" /> Faculty Noticeboard
          </h1>
          <p className="text-sm text-slate-500">
            View staff circulars, administrative updates, and post announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] transition shadow-sm"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B63E0] hover:bg-[#1552BD] rounded-xl shadow-md shadow-blue-500/20 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Post Notice
          </button>
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
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  notice.priority === 'High' ? 'bg-red-500' : notice.priority === 'Medium' ? 'bg-amber-500' : 'bg-[#1B63E0]'
                }`}></div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border tracking-wide ${getPriorityBadge(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0B1E36] mb-2 group-hover:text-[#1B63E0] transition">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {notice.content}
                  </p>
                </div>

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
                There are no active faculty notices matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-[#0B1E36]">Post New Notice</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Exam Paper Submission Deadline"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Students">Students</option>
                    <option value="Teachers">Teachers</option>
                    <option value="Parents">Parents</option>
                    <option value="All">All</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Priority</label>
                  <select
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Content / Description</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Write notice details here..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B63E0]/30 focus:border-[#1B63E0] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-[#1B63E0] hover:bg-[#1552BD] rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}