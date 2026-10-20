"use client";

import { useState } from "react";

export default function ManageSchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const schools = [
    {
      id: 1,
      name: "Lahore Model School",
      email: "info@lahoremodel.edu.pk",
      city: "Lahore",
      plan: "Premium",
      status: "Active",
      students: 1240,
      registered: "Jan 15, 2026",
    },
    {
      id: 2,
      name: "Karachi Academy",
      email: "admin@karachiaca.edu.pk",
      city: "Karachi",
      plan: "Standard",
      status: "Active",
      students: 890,
      registered: "Feb 3, 2026",
    },
    {
      id: 3,
      name: "Islamabad Grammar",
      email: "contact@isbgrammar.edu.pk",
      city: "Islamabad",
      plan: "Premium",
      status: "Pending",
      students: 0,
      registered: "Mar 10, 2026",
    },
    {
      id: 4,
      name: "Punjab Public School",
      email: "hello@punjabpublic.edu.pk",
      city: "Faisalabad",
      plan: "Basic",
      status: "Active",
      students: 450,
      registered: "Apr 22, 2026",
    },
    {
      id: 5,
      name: "Sindh Model High",
      email: "info@sindhmodel.edu.pk",
      city: "Hyderabad",
      plan: "Standard",
      status: "Expired",
      students: 620,
      registered: "May 5, 2026",
    },
    {
      id: 6,
      name: "The Core Montessori",
      email: "admin@coremon.edu.pk",
      city: "Lahore",
      plan: "Premium",
      status: "Active",
      students: 320,
      registered: "Jun 12, 2026",
    },
  ];

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || school.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Expired") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPlanColor = (plan) => {
    if (plan === "Premium") return "bg-purple-100 text-purple-700";
    if (plan === "Standard") return "bg-blue-100 text-blue-700";
    if (plan === "Basic") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Schools</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total {schools.length} schools registered on the platform
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md">
          + Add New School
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by school name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  School
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  City
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Plan
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Students
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No schools found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {school.name}
                        </p>
                        <p className="text-xs text-gray-500">{school.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {school.city}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${getPlanColor(
                          school.plan
                        )}`}
                      >
                        {school.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {school.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                          school.status
                        )}`}
                      >
                        {school.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}