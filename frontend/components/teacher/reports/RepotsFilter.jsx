import { Search, Filter } from "lucide-react";

export default function ReportsFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedClass,
  setSelectedClass,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search report title or ID..."
          className="w-full bg-slate-50 text-xs text-slate-700 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Attendance">Attendance</option>
            <option value="Assessment">Assessment</option>
            <option value="Conduct">Conduct</option>
          </select>
        </div>

        {/* Class Filter */}
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Classes</option>
            <option value="10th">Class 10th</option>
            <option value="9th">Class 9th</option>
          </select>
        </div>
      </div>
    </div>
  );
}