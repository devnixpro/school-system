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
        const response = await api.get("/students");
        
        console.log("API Response:", response); // check data
    

        // API response handel structure
        let studentsData = [];
        if (Array.isArray(response)) {
          studentsData = response;
        } else if (Array.isArray(response?.data)) {
          studentsData = response.data;
        } else if (Array.isArray(response?.data?.students)) {
          studentsData = response.data.students;
        } else if (Array.isArray(response?.students)) {
          studentsData = response.students;
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

  // Safety check: If the students array doesn't exist, an empty array will be used so .filter doesn't throw an error.
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
    <div className="p-6 bg-[#090a0f] min-h-screen text-slate-100 space-y-6">
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
        <div className="bg-[#11131f] rounded-2xl border border-slate-800/80 p-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading students records...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center text-rose-400 text-xs">
          {error}
        </div>
      ) : (
        <StudentsTable students={filteredStudents} totalCount={safeStudents.length} />
      )}
    </div>
  );
}