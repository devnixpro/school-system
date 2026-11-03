import React from 'react';
import { Search } from 'lucide-react';

export function TeacherFilters({ searchTerm, setSearchTerm, selectedDept, setSelectedDept }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      <div className="w-full sm:w-auto">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="All">All Departments</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Computer Science">Computer Science</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="Social Studies">Social Studies</option>
          <option value="Urdu">Urdu</option>
          <option value="Islamiat">Islamiat</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Physics">Physics</option>
        </select>
      </div>
    </div>
  );
}