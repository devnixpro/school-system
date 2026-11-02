import React from 'react';
import { Check } from 'lucide-react';

export const StepTracker = ({ steps, currentStep }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-0" />
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                      : isCurrent 
                      ? 'bg-white border-2 border-blue-600 text-blue-600 ring-4 ring-blue-100' 
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-gray-400">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};