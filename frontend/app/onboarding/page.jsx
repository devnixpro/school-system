'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import { Header } from '@/components/onboarding/Header';
import { StepTracker } from '@/components/onboarding/StepTracker';
import { Step1SchoolProfile } from '@/components/onboarding/Step1SchoolProfile';
import { Step2Modules } from '@/components/onboarding/Step2Models';
import { Step3AdminSetup } from '@/components/onboarding/Step3AdminSetup';
import { Step4Success } from '@/components/onboarding/Step4Success';
import { LivePreview } from '@/components/onboarding/LivePreview';
import api from '@/services/api';

// const STEPS = [
//   { id: 1, title: 'School Profile', subtitle: 'Basic Details' },
//   { id: 2, title: 'Modules', subtitle: 'Select Features' },
//   { id: 3, title: 'Admin Setup', subtitle: 'Account Info' },
//   { id: 4, title: 'Complete', subtitle: 'Ready to Launch' },
// ];

// export default function OnboardingPage() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     schoolName: '',
//     schoolType: 'Primary & Secondary',
//     city: '',
//     address: '',
//     studentCount: 500,
//     selectedModules: ['students', 'attendance', 'fees', 'exams', 'communication'],
//     adminName: '',
//     adminEmail: '',
//     adminPhone: '',
//   });

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const toggleModule = (id) => {
//     setFormData((prev) => {
//       const exists = prev.selectedModules.includes(id);
//       return {
//         ...prev,
//         selectedModules: exists
//           ? prev.selectedModules.filter((m) => m !== id)
//           : [...prev.selectedModules, id],
//       };
//     });
//   };

//   // 🚀 Save progress/submit data to Express Backend via `api` service
//   const handleSaveOnboarding = async (stepNumber) => {
//     setLoading(true);
//     try {
//       const payload = {
//         userId: "64a1b2c3d4e5f67890123456", // Real logged-in User ID replace karein
//         role: "admin",
//         stepCompleted: stepNumber,
//         personalInfo: {
//           fullName: formData.adminName || "Admin User",
//           phone: formData.adminPhone,
//           email: formData.adminEmail,
//         },
//         schoolDetails: {
//           schoolName: formData.schoolName,
//           academicYear: "2026-2027",
//           branchName: "Main Campus",
//           phone: formData.adminPhone,
//           address: formData.address,
//         },
//         selectedModules: formData.selectedModules,
//       };

//       // Express endpoint: POST /onboarding/save
//       const response = await api.post('/onboarding/save', payload);

//       if (response.data?.success || response.status === 200) {
//         if (stepNumber >= 3) {
//           setCurrentStep(4); // Success screen par le jayen
//         } else {
//           setCurrentStep((prev) => prev + 1);
//         }
//       } else {
//         alert(response.data?.message || 'Failed to save onboarding data.');
//       }
//     } catch (error) {
//       console.error('Onboarding API Error:', error);
//       alert(error.response?.data?.message || 'Error connecting to server. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (currentStep === 3) {
//       // Final step par complete onboarding save karein
//       handleSaveOnboarding(3);
//     } else if (currentStep < 3) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) setCurrentStep((prev) => prev - 1);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
//       <Header />
//       <StepTracker steps={STEPS} currentStep={currentStep} />

//       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
//           {/* Form Wizard */}
//           <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[500px]">
//             <div>
//               {currentStep === 1 && (
//                 <Step1SchoolProfile formData={formData} onChange={handleInputChange} />
//               )}
//               {currentStep === 2 && (
//                 <Step2Modules formData={formData} toggleModule={toggleModule} />
//               )}
//               {currentStep === 3 && (
//                 <Step3AdminSetup formData={formData} onChange={handleInputChange} />
//               )}
//               {currentStep === 4 && (
//                 <Step4Success formData={formData} />
//               )}
//             </div>

//             {/* Navigation Controls */}
//             {currentStep < 4 && (
//               <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
//                 <button
//                   onClick={handleBack}
//                   disabled={currentStep === 1 || loading}
//                   className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
//                     currentStep === 1 || loading
//                       ? 'text-gray-300 cursor-not-allowed'
//                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                   }`}
//                 >
//                   <ArrowLeft className="w-4 h-4" /> Back
//                 </button>

//                 <button
//                   onClick={handleNext}
//                   disabled={loading}
//                   className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
//                 >
//                   {loading ? 'Saving...' : currentStep === 3 ? 'Complete Setup' : 'Next Step'}{' '}
//                   {!loading && <ArrowRight className="w-4 h-4" />}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Side System Preview Panel */}
//           <div className="lg:col-span-5">
//             <LivePreview formData={formData} />
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }
// app/onboarding/page.jsx


const STEPS = [
  { id: 1, title: 'School Profile', subtitle: 'Basic Details' },
  { id: 2, title: 'Modules', subtitle: 'Select Features' },
  { id: 3, title: 'Admin Setup', subtitle: 'Account Info' },
  { id: 4, title: 'Complete', subtitle: 'Ready to Launch' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: 'Primary & Secondary',
    city: '',
    address: '',
    studentCount: 500,
    selectedModules: ['students', 'attendance', 'fees', 'exams', 'communication'],
    adminName: '',
    adminEmail: '',
    adminPhone: '',
  });

  const handleInputChange = (field, value) => {
    setGlobalError('');
    setErrors((prev) => ({ ...prev, [field]: '' })); // Clear specific field error
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleModule = (id) => {
    setGlobalError('');
    setFormData((prev) => {
      const exists = prev.selectedModules.includes(id);
      return {
        ...prev,
        selectedModules: exists
          ? prev.selectedModules.filter((m) => m !== id)
          : [...prev.selectedModules, id],
      };
    });
  };

  // 🔒 Comprehensive Step Validation Logic
  const validateStep = () => {
    let newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.schoolName.trim()) {
        newErrors.schoolName = 'School Name is required.';
        isValid = false;
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City name is required.';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (formData.selectedModules.length === 0) {
        setGlobalError('Please select at least one module.');
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.adminName.trim()) {
        newErrors.adminName = 'Admin Full Name is required.';
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.adminEmail.trim() || !emailRegex.test(formData.adminEmail)) {
        newErrors.adminEmail = 'Valid work email address is required.';
        isValid = false;
      }
      if (!formData.adminPhone.trim() || formData.adminPhone.length < 10) {
        newErrors.adminPhone = 'Valid phone/WhatsApp number is required.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // 🚀 Backend API Call
  const handleSaveOnboarding = async (stepNumber) => {
    setLoading(true);
    try {
      const payload = {
        userId: "64a1b2c3d4e5f67890123456", // Replace with real auth user ID
        role: "admin",
        stepCompleted: stepNumber,
        personalInfo: {
          fullName: formData.adminName,
          phone: formData.adminPhone,
          email: formData.adminEmail,
        },
        schoolDetails: {
          schoolName: formData.schoolName,
          academicYear: "2026-2027",
          branchName: "Main Campus",
          phone: formData.adminPhone,
          address: formData.address,
        },
        selectedModules: formData.selectedModules,
      };

      const response = await api.post('/onboarding/save', payload);

      if (response.data?.success || response.status === 200) {
        setCurrentStep(4); // Success screen
      } else {
        setGlobalError(response.data?.message || 'Failed to save onboarding data.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setGlobalError(error.response?.data?.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep === 3) {
      handleSaveOnboarding(3);
    } else if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setGlobalError('');
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <StepTracker steps={STEPS} currentStep={currentStep} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Wizard */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[500px]">
            <div>
              {currentStep === 1 && (
                <Step1SchoolProfile formData={formData} onChange={handleInputChange} errors={errors} />
              )}
              {currentStep === 2 && (
                <Step2Modules formData={formData} toggleModule={toggleModule} />
              )}
              {currentStep === 3 && (
                <Step3AdminSetup formData={formData} onChange={handleInputChange} errors={errors} />
              )}
              {currentStep === 4 && (
                <Step4Success formData={formData} />
              )}

              {/* Global Error Banner */}
              {globalError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                  ⚠️ {globalError}
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            {currentStep < 4 && (
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1 || loading}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    currentStep === 1 || loading
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : currentStep === 3 ? 'Complete Setup' : 'Next Step'}{' '}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Side System Preview Panel */}
          <div className="lg:col-span-5">
            <LivePreview formData={formData} />
          </div>

        </div>
      </main>
    </div>
  );
}