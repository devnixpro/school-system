import React from 'react';
import { Building2, MapPin, Users } from 'lucide-react';

export const Step1SchoolProfile = ({ formData, onChange, touched, errors }) => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">School Details</h2>
        <p className="text-sm text-gray-500">Provide basic information about your institution.</p>
      </div>

      <div className="space-y-4">
        {/* School Name Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            School Name *
          </label>
          <div className="relative">
            <Building2 className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors?.schoolName ? 'text-red-400' : 'text-gray-400'}`} />
            <input 
              type="text"
              placeholder="e.g. Lahore Grammar School"
              value={formData.schoolName}
              onChange={(e) => onChange('schoolName', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:outline-none ${
                errors?.schoolName 
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
          </div>
          {errors?.schoolName && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.schoolName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              School Category
            </label>
            <select 
              value={formData.schoolType}
              onChange={(e) => onChange('schoolType', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
            >
              <option value="Primary & Secondary">Primary & Secondary</option>
              <option value="Higher Secondary / College">Higher Secondary / College</option>
              <option value="Montessori / Preschool">Montessori / Preschool</option>
              <option value="Islamic Academy">Islamic Academy</option>
            </select>
          </div>

          {/* City Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              City *
            </label>
            <div className="relative">
              <MapPin className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors?.city ? 'text-red-400' : 'text-gray-400'}`} />
              <input 
                type="text"
                placeholder="e.g. Lahore, Karachi"
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:outline-none ${
                  errors?.city 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                    : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                }`}
              />
            </div>
            {errors?.city && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.city}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Full Address
          </label>
          <input 
            type="text"
            placeholder="Street address, Sector or Area"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" /> Total Students
            </label>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {formData.studentCount} Students
            </span>
          </div>
          <input 
            type="range"
            min="50"
            max="3000"
            step="50"
            value={formData.studentCount}
            onChange={(e) => onChange('studentCount', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
};