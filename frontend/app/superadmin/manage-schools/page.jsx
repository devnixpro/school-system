"use client";

import { useState, useEffect } from "react";

export default function ManageSchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Data states
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: "", city: "", email: "", plan: "Basic", status: "Active", students: 0 });
  
  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  // FETCH: Saare schools laana
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login first.");

      const response = await fetch("http://localhost:5000/api/superadmin/schools", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch schools");
      setSchools(data.data || data); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // CREATE: Naya school add karna
  const handleAddSchool = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/superadmin/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newSchool),
      });

      if (!response.ok) throw new Error("Failed to add school");

      alert("School added successfully!");
      setIsModalOpen(false);
      setNewSchool({ name: "", city: "", email: "", plan: "Basic", status: "Active", students: 0 }); 
      fetchSchools(); 
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // UPDATE: School edit karna
  const handleUpdateSchool = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/superadmin/schools/${editSchool._id || editSchool.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editSchool),
      });

      if (!response.ok) throw new Error("Failed to update school");

      alert("School updated successfully!");
      setIsEditModalOpen(false);
      fetchSchools(); // List refresh karein
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // DELETE: School delete karna
  const handleDeleteSchool = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school? This action cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/superadmin/schools/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete school");

      alert("School deleted successfully!");
      fetchSchools(); // List refresh karein
    } catch (err) {
      alert(err.message);
    }
  };

  // Search aur Filter logic
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city?.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading schools from database...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-200">
        <strong>Error:</strong> {error}
      </div>
    </div>
  );

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
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md"
        >
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
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">School</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">City</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No schools found.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school._id || school.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{school.name}</p>
                        <p className="text-xs text-gray-500">{school.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{school.city}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPlanColor(school.plan)}`}>
                        {school.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(school.status)}`}>
                        {school.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Edit Button */}
                        <button 
                          onClick={() => { setEditSchool(school); setIsEditModalOpen(true); }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteSchool(school._id || school.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
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

      {/* ================= ADD MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New School</h2>
            <form onSubmit={handleAddSchool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input type="text" required value={newSchool.name} onChange={(e) => setNewSchool({...newSchool, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" required value={newSchool.city} onChange={(e) => setNewSchool({...newSchool, city: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={newSchool.email} onChange={(e) => setNewSchool({...newSchool, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select value={newSchool.plan} onChange={(e) => setNewSchool({...newSchool, plan: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{submitLoading ? "Adding..." : "Add School"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {isEditModalOpen && editSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit School</h2>
            <form onSubmit={handleUpdateSchool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input type="text" required value={editSchool.name} onChange={(e) => setEditSchool({...editSchool, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" required value={editSchool.city} onChange={(e) => setEditSchool({...editSchool, city: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={editSchool.email} onChange={(e) => setEditSchool({...editSchool, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select value={editSchool.plan} onChange={(e) => setEditSchool({...editSchool, plan: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editSchool.status} onChange={(e) => setEditSchool({...editSchool, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{submitLoading ? "Updating..." : "Update School"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}