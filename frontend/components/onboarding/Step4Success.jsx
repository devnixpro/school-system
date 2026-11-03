import React from 'react';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Step4Success = ({ formData }) => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    // Admin dashboard par redirect karein (role-based router ya direct admin route)
    router.push('/dashboard/admin'); 
  };

  return (
    <div className="text-center py-6 space-y-5">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-bounce">
        <Rocket className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900">Portal Ready to Launch!</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Congratulations! <strong className="text-gray-900">{formData.schoolName || 'Your School'}</strong> is fully configured on DevNixEdu portal.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-sm mx-auto text-left space-y-2 text-xs">
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">School:</span>
          <span className="font-semibold text-gray-900">{formData.schoolName || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">Admin Email:</span>
          <span className="font-semibold text-gray-900">{formData.adminEmail || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">Capacity:</span>
          <span className="font-semibold text-gray-900">{formData.studentCount} Students</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Active Modules:</span>
          <span className="font-semibold text-blue-600">{formData.selectedModules.length} Active</span>
        </div>
      </div>

      <button 
        onClick={handleGoToDashboard}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" /> Go to Admin Dashboard <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};