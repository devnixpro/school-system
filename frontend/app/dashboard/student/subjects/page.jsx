"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import SubjectHeader from "@/components/student/subjects/SubjectHeader";
import SubjectFilters from "@/components/student/subjects/SubjectFilters";
import SubjectCard from "@/components/student/subjects/SubjectCard";

export default function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All");

  // Fallback dummy data agar API fail ho jaye ya backend ready na ho
  const dummySubjects = [
    {
      id: 1,
      name: "Advanced Mathematics",
      code: "MTH-401",
      instructor: "Dr. Ahmed Khan",
      progress: "85%",
      lecturesCompleted: 24,
      totalLectures: 30,
      schedule: "Mon, Wed (10:00 AM)",
      grade: "A+",
    },
    {
      id: 2,
      name: "Data Structures & Algorithms",
      code: "CS-302",
      instructor: "Prof. Sarah Malik",
      progress: "70%",
      lecturesCompleted: 18,
      totalLectures: 25,
      schedule: "Tue, Thu (02:00 PM)",
      grade: "A",
    },
    {
      id: 3,
      name: "Physics - Mechanics",
      code: "PHY-201",
      instructor: "Dr. Tariq Jamil",
      progress: "60%",
      lecturesCompleted: 15,
      totalLectures: 25,
      schedule: "Fri (09:00 AM)",
      grade: "B+",
    },
    {
      id: 4,
      name: "English Literature",
      code: "ENG-101",
      instructor: "Ms. Ayesha Omar",
      progress: "90%",
      lecturesCompleted: 27,
      totalLectures: 30,
      schedule: "Mon, Wed (01:00 PM)",
      grade: "A+",
    },
  ];

  // Fetch Subjects from Backend API with Fallback
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await api.get("/student/subjects");
        const data = response?.data || response;

        // Agar API data return kare to wo set ho jaye, warna dummy data
        if (Array.isArray(data) && data.length > 0) {
          setSubjects(data);
        } else {
          setSubjects(dummySubjects);
        }
      } catch (err) {
        console.warn("API failed, falling back to dummy data:", err);
        // API fail hone par dummy data use hoga taakay UI block na ho
        setSubjects(dummySubjects);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Filter Logic
  const filteredSubjects = subjects.filter((subj) => {
    const matchesSearch =
      subj.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subj.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subj.instructor?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800 space-y-6 font-sans">
      
      {/* Header Component */}
      <SubjectHeader totalCount={subjects.length} />

      {/* Filter Component */}
      <SubjectFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading your subjects...</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <p className="text-xs text-slate-500">No subjects found matching your search.</p>
        </div>
      ) : (
        /* Subjects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredSubjects.map((subj) => (
            <SubjectCard key={subj.id || subj.code} subj={subj} />
          ))}
        </div>
      )}

    </div>
  );
}