import React from 'react';
import { Users, Phone, CheckCircle2, XCircle, Trash2, Pencil, Loader2 } from 'lucide-react';

export function TeacherTable({ teachers, loading, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin"/>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 text-gray-400 space-y-2">
        <Users className="w-12 h-12 mx-auto stroke-1 text-gray-300"/>
        <p className="text-sm font-medium">No teachers found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Teacher Name</th>
              <th className="py-3.5 px-6">Department</th>
              <th className="py-3.5 px-6">Qualification</th>
              <th className="py-3.5 px-6">Contact Info</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm">
                      {teacher.name ? teacher.name.charAt(0) : 'T'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{teacher.name}</p>
                      <p className="text-[11px] text-gray-500">{teacher.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-gray-700">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-semibold">
                    {teacher.department || 'General'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600 font-medium">
                  {teacher.qualification || 'N/A'}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400"/> {teacher.phone || 'N/A'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  {teacher.isActive !== false ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3"/> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full text-[11px] font-semibold">
                      <XCircle className="w-3 h-3"/> Inactive
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => onEdit(teacher)}
                      className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                      title="Edit Teacher"
                    >
                      <Pencil className="w-4 h-4"/>
                    </button>
                    <button 
                      onClick={() => onDelete(teacher._id)}
                      className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Teacher"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}