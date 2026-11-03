import React from 'react';
import { X } from 'lucide-react';

export function AddStudentModal({ isOpen, onClose, formData, onChange, onSubmit, submitting, errorMsg, isEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Edit Student Details' : 'Enroll New Student'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ''}
                onChange={onChange}
                placeholder="e.g. Hamza Ali"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Roll Number *</label>
              <input
                type="text"
                name="rollNumber"
                required
                value={formData.rollNumber || ''}
                onChange={onChange}
                placeholder="e.g. ST-2026-001"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email || ''}
                onChange={onChange}
                placeholder="student@school.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={onChange}
                placeholder="+92 300 0000000"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Class / Grade *</label>
              <select
                name="class"
                value={formData.class || '10th Grade'}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section || 'A'}
                onChange={onChange}
                placeholder="e.g. A"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : (isEditing ? 'Update Student' : 'Save & Enroll')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}