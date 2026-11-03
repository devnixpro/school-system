import React from 'react';
import { Search, Filter } from 'lucide-react';

export function StudentFilters({ searchTerm, setSearchTerm, selectedClass, setSelectedClass }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-50 text-xs text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <Filter className="w-4 h-4 text-gray-400" /> Filter Class:
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-50 text-xs text-gray-800 font-medium px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="All">All Classes</option>
          <option value="9th Grade">9th Grade</option>
          <option value="10th Grade">10th Grade</option>
          <option value="11th Grade">11th Grade</option>
          <option value="12th Grade">12th Grade</option>
        </select>
      </div>
    </div>
  );
}