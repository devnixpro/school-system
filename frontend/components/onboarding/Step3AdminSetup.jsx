import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Step3AdminSetup = ({ formData, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Admin Account</h2>
        <p className="text-sm text-gray-500">Create the primary administrator credentials.</p>
      </div>

      <div className="space-y-4">
        {/* Admin Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Admin Full Name *
          </label>
          <div className="relative">
            <User className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors?.adminName ? 'text-red-400' : 'text-gray-400'}`} />
            <input 
              type="text"
              placeholder="e.g. Principal Ali Khan"
              value={formData.adminName}
              onChange={(e) => onChange('adminName', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:outline-none ${
                errors?.adminName ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
          </div>
          {errors?.adminName && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.adminName}</p>}
        </div>

        {/* Admin Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Work Email Address *
          </label>
          <div className="relative">
            <Mail className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors?.adminEmail ? 'text-red-400' : 'text-gray-400'}`} />
            <input 
              type="email"
              placeholder="admin@school.edu.pk"
              value={formData.adminEmail}
              onChange={(e) => onChange('adminEmail', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:outline-none ${
                errors?.adminEmail ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
          </div>
          {errors?.adminEmail && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.adminEmail}</p>}
        </div>

        {/* Admin Password with Eye Toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Admin Password *
          </label>
          <div className="relative">
            <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors?.adminPassword ? 'text-red-400' : 'text-gray-400'}`} />
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.adminPassword || ''}
              onChange={(e) => onChange('adminPassword', e.target.value)}
              className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:outline-none ${
                errors?.adminPassword ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors?.adminPassword && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.adminPassword}</p>}
        </div>

        {/* Admin Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Phone / WhatsApp Number *
          </label>
          <div className="relative">
            <Phone className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${errors?.adminPhone ? 'text-red-400' : 'text-gray-400'}`} />
            <input 
              type="tel"
              placeholder="+92 300 1234567"
              value={formData.adminPhone}
              onChange={(e) => onChange('adminPhone', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:outline-none ${
                errors?.adminPhone ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
          </div>
          {errors?.adminPhone && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.adminPhone}</p>}
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your data is protected with enterprise 256-bit SSL encryption. We will send login credentials and portal setup instructions to this email.
          </p>
        </div>
      </div>
    </div>
  );
};