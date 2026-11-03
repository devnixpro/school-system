"use client";

import React, { useState, useEffect } from "react";
import StudentsHeader from "@/components/teacher/students/StudentHeader";
import StudentsStats from "@/components/teacher/students/StudentStatus";
import StudentsFilter from "@/components/teacher/students/StudentsFilter";
import StudentsTable from "@/components/teacher/students/StudentTable";
import api from "@/services/api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch Students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/students");
        
        let studentsData = [];
        const resData = response?.data || response;

        if (Array.isArray(resData)) {
          studentsData = resData;
        } else if (Array.isArray(resData?.students)) {
          studentsData = resData.students;
        } else if (Array.isArray(resData?.data)) {
          studentsData = resData.data;
        }

        setStudents(studentsData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load students data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const safeStudents = Array.isArray(students) ? students : [];

  // Filter Logic
  const filteredStudents = safeStudents.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo?.toString().includes(searchQuery);

    const matchesClass =
      selectedClass === "All" || student.class?.includes(selectedClass);
    const matchesStatus =
      selectedStatus === "All" || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 space-y-6">
      <StudentsHeader />
      <StudentsStats studentsCount={safeStudents.length} />
      
      <StudentsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Loading students records...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-600 text-xs shadow-sm">
          {error}
        </div>
      ) : (
        <StudentsTable students={filteredStudents} totalCount={safeStudents.length} />
      )}
    </div>
  );
}