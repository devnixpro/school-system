"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import ClassHeader from "@/components/teacher/subjects/ClassHeader";
import ClassFilters from "@/components/teacher/subjects/ClassFilters";
import ClassCard from "@/components/teacher/subjects/ClassCard";

export default function TeacherSubjectsPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Classes & Subjects from Backend
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/classes");
        const data = response?.data || response;
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch classes and subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, []);

  // Fallback dummy data agar backend abhi ready na ho
  const dummyClasses = [
    {
      id: 1,
      className: "Grade 10 - Computer Science",
      section: "Section A",
      totalStudents: 45,
      subjects: [
        { name: "Data Structures", code: "CS-101", lectures: 24, progress: "80%" },
        { name: "Database Systems", code: "CS-102", lectures: 18, progress: "65%" },
        { name: "Web Development", code: "CS-103", lectures: 30, progress: "90%" },
      ],
    },
    {
      id: 2,
      className: "Grade 9 - Mathematics",
      section: "Section B",
      totalStudents: 38,
      subjects: [
        { name: "Algebra", code: "MTH-201", lectures: 22, progress: "70%" },
        { name: "Geometry", code: "MTH-202", lectures: 15, progress: "50%" },
      ],
    },
    {
      id: 3,
      className: "Grade 11 - Physics",
      section: "Section A",
      totalStudents: 30,
      subjects: [
        { name: "Mechanics", code: "PHY-301", lectures: 25, progress: "85%" },
        { name: "Thermodynamics", code: "PHY-302", lectures: 20, progress: "60%" },
      ],
    },
  ];

  const classDataToDisplay = classes.length > 0 ? classes : dummyClasses;

  // Filter Logic
  const filteredClasses = classDataToDisplay.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedClass === "All" || cls.className.includes(selectedClass);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 space-y-6">
      
      {/* Header Component */}
      <ClassHeader onAddClick={() => setIsModalOpen(true)} />

      {/* Filter Component */}
      <ClassFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {/* Content Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Loading your classes...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-xs text-slate-500">No classes or subjects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}

    </div>
  );
}