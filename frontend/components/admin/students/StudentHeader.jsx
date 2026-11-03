import React from 'react';
import { Users, Plus } from 'lucide-react';

export function StudentHeader({ onOpenModal }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" /> Students Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage enrolled students, academic grades, and portal accounts.
        </p>
      </div>

      <button
        onClick={onOpenModal}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add New Student
      </button>
    </div>
  );
}