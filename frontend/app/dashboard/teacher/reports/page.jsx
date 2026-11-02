"use client";

import React, { useState } from "react";
import ReportsHeader from "@/components/teacher/reports/RepotsHeader";
import ReportsStats from "@/components/teacher/reports/RepotsStatus";
import ReportsFilter from "@/components/teacher/reports/RepotsFilter";
import ReportsTable from "@/components/teacher/reports/RepotsTable";

// Sample Reports Data
const initialReports = [
  {
    id: "REP-001",
    title: "Mid-Term Academic Performance",
    category: "Academic",
    class: "10th - A",
    generatedDate: "2026-10-18",
    status: "Completed",
    fileSize: "2.4 MB",
  },
  {
    id: "REP-002",
    title: "Monthly Attendance Summary",
    category: "Attendance",
    class: "9th - B",
    generatedDate: "2026-10-15",
    status: "Completed",
    fileSize: "1.1 MB",
  },
  {
    id: "REP-003",
    title: "Physics Quiz Analysis - Chapter 4",
    category: "Assessment",
    class: "10th - B",
    generatedDate: "2026-10-12",
    status: "Pending Review",
    fileSize: "850 KB",
  },
  {
    id: "REP-004",
    title: "Behavioral & Discipline Log",
    category: "Conduct",
    class: "9th - A",
    generatedDate: "2026-10-10",
    status: "Completed",
    fileSize: "1.5 MB",
  },
  {
    id: "REP-005",
    title: "Final Term Preparation Progress",
    category: "Academic",
    class: "10th - A",
    generatedDate: "2026-10-05",
    status: "Draft",
    fileSize: "3.0 MB",
  },
];

export default function ReportsPage() {
  const [reports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");

  // Filter Logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || report.category === selectedCategory;
    const matchesClass =
      selectedClass === "All" || report.class.includes(selectedClass);

    return matchesSearch && matchesCategory && matchesClass;
  });

  return (
    <div className="p-6 bg-slate-100 min-h-screen text-slate-800 space-y-6">
      <ReportsHeader />
      <ReportsStats />
      <ReportsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />
      <ReportsTable reports={filteredReports} totalCount={reports.length} />
    </div>
  );
}