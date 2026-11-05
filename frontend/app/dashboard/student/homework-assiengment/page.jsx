"use client";
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Loader2, 
  ExternalLink,
  Calendar
} from 'lucide-react';
import api from '@/services/api';

export default function StudentHomeworkPage({ studentId = "123" }) {
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'SUBMITTED' | 'LATE'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/homework`);
        setHomeworkList(response.data?.data || response.data || []);
      } catch (err) {
        console.error("Error fetching homeworks, using mock fallback:", err);
        // Mock data for initial testing
        setHomeworkList([
          {
            _id: "1",
            title: "Algebra & Polynomials Problem Set 4",
            subject: "Mathematics",
            assignedBy: "Prof. Sharma",
            assignedDate: "2026-09-28",
            dueDate: "2026-10-05",
            status: "PENDING",
            description: "Solve all problems from exercise 4.2 in the workbook and show all working steps.",
            attachmentUrl: "#"
          },
          {
            _id: "2",
            title: "Newton's Laws of Motion Lab Report",
            subject: "Physics",
            assignedBy: "Dr. Verma",
            assignedDate: "2026-09-25",
            dueDate: "2026-10-02",
            status: "LATE",
            description: "Submit the complete lab report including observations and graphs.",
            attachmentUrl: "#"
          },
          {
            _id: "3",
            title: "Data Structures - Linked List Implementation",
            subject: "Computer Science",
            assignedBy: "Er. Amit Kumar",
            assignedDate: "2026-09-20",
            dueDate: "2026-09-28",
            status: "SUBMITTED",
            submittedOn: "2026-09-27",
            marksObtained: 18,
            totalMarks: 20,
            description: "Implement singly linked list methods in C++ or Java."
          },
          {
            _id: "4",
            title: "Chemical Bonding Worksheet",
            subject: "Chemistry",
            assignedBy: "Dr. Neha Gupta",
            assignedDate: "2026-09-22",
            dueDate: "2026-09-29",
            status: "SUBMITTED",
            submittedOn: "2026-09-28",
            marksObtained: 25,
            totalMarks: 25,
            description: "Complete chapter review questions on covalent and ionic bonding."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [studentId]);

  const subjects = ['ALL', ...new Set(homeworkList.map(hw => hw.subject))];

  const filteredHomeworks = homeworkList.filter(hw => {
    const matchesTab = activeTab === 'ALL' || hw.status === activeTab;
    const matchesSubject = selectedSubject === 'ALL' || hw.subject === selectedSubject;
    const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          hw.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSubject && matchesSearch;
  });

  const pendingCount = homeworkList.filter(h => h.status === 'PENDING').length;
  const submittedCount = homeworkList.filter(h => h.status === 'SUBMITTED').length;
  const lateCount = homeworkList.filter(h => h.status === 'LATE').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Overdue / Late
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold">Homework list load ho raha hai...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Homework & Assignments</h1>
          <p className="text-xs text-slate-500 mt-1">View pending tasks, submit assignments, and check grades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Tasks</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Need attention</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Submitted</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{submittedCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Completed & turned in</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Overdue / Late</span>
            <div className="text-2xl font-black text-rose-600 mt-1">{lateCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Past due date</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {['ALL', 'PENDING', 'SUBMITTED', 'LATE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'ALL' ? 'All Tasks' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search homework..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj === 'ALL' ? 'All Subjects' : subj}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

      </div>

      <div className="space-y-4">
        {filteredHomeworks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Homework Found</h3>
            <p className="text-xs text-slate-400">There are no assignments matching your current criteria.</p>
          </div>
        ) : (
          filteredHomeworks.map((hw) => (
            <div 
              key={hw._id} 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all space-y-4"
            >
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg">
                    {hw.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Assigned by: {hw.assignedBy}</span>
                </div>
                <div>{getStatusBadge(hw.status)}</div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">{hw.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{hw.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Assigned: {new Date(hw.assignedDate).toLocaleDateString()}</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${
                    hw.status === 'LATE' ? 'text-rose-600 font-bold' : 'text-amber-600'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hw.attachmentUrl && (
                    <a
                      href={hw.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" /> Reference File <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {hw.status === 'SUBMITTED' ? (
                    <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                      <span>Submitted on {new Date(hw.submittedOn).toLocaleDateString()}</span>
                      {hw.marksObtained !== undefined && (
                        <span className="bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md font-extrabold">
                          {hw.marksObtained}/{hw.totalMarks} Marks
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => alert(`Submit modal for assignment: ${hw.title}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-200"
                    >
                      <Upload className="w-3.5 h-3.5" /> Submit Assignment
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}