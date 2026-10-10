"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, FileText, Calendar, Trash2, Edit3, Upload, 
  X, CheckCircle, AlertCircle, Loader2, Download 
} from 'lucide-react';
import api from '@/services/api';

const MOCK_CLASSES = [
  { id: "10-a", name: "Grade 10 - Section A" },
  { id: "10-b", name: "Grade 10 - Section B" },
  { id: "9-a", name: "Grade 9 - Section A" },
  { id: "11-sci", name: "Grade 11 - Science" },
];

export default function HomeworkPage() {
  const [homeworks, setHomeworks] = useState([]);
  const [selectedClass, setSelectedClass] = useState('10-a');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '10-a',
    subject: '',
    dueDate: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // GET: Fetch Homework List
  const fetchHomeworks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/homework', {
        params: { classId: selectedClass }
      });
      setHomeworks(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Homework records is not fetch.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const openModal = (homework = null) => {
    if (homework) {
      setEditingId(homework._id);
      setFormData({
        title: homework.title,
        description: homework.description || '',
        classId: homework.classId,
        subject: homework.subject,
        dueDate: homework.dueDate ? new Date(homework.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        classId: selectedClass,
        subject: '',
        dueDate: '',
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSelectedFile(null);
  };

  // POST & PUT: Create or Update Homework
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('classId', formData.classId);
    data.append('subject', formData.subject);
    data.append('dueDate', formData.dueDate);
    if (selectedFile) {
      data.append('file', selectedFile);
    }

    try {
      if (editingId) {
        // PUT Request
        await api.put(`/homework/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMsg("Homework successfully updated!");
      } else {
        // POST Request
        await api.post('/homework', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMsg("New homework successfully assign!");
      }

      closeModal();
      fetchHomeworks();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed. Try Again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // DELETE: Delete Homework Item
  const handleDelete = async (id) => {
    if (!confirm("Are you shour to delete this homework?")) return;

    try {
      await api.delete(`/homework/${id}`);
      setSuccessMsg("Homework delete successfull!");
      fetchHomeworks();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Delete operation failed.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        {successMsg && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> {successMsg}
          </span>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Homework & Assignments</h1>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {MOCK_CLASSES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => openModal()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Homework
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cards List Section */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">Assignments is loading...</span>
        </div>
      ) : homeworks.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-600">homework is not assign.</p>
          <p className="text-xs text-slate-400 mt-1">Click the “Create Homework” button to add new homework.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeworks.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-indigo-100">
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button onClick={() => openModal(item)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description || "No description provided."}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                </div>

                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> File
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Homework" : "Create New Homework"}
              </h2>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Algebra Worksheet #3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Class *</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {MOCK_CLASSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Assignment ki details instructions yahan likhein..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Attachment (PDF/Image)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50 relative hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{selectedFile ? selectedFile.name : "Choose File or Drop Here"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Homework" : "Publish Homework"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}