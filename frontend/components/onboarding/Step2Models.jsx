import React from 'react';
import * as Icons from 'lucide-react';
import { MODULES_DATA } from '../../data/modelData';

export const Step2Modules = ({ formData, toggleModule }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Select Modules</h2>
        <p className="text-sm text-gray-500">Choose the features you want to activate for your campus.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {MODULES_DATA.map((mod) => {
          const isSelected = formData.selectedModules.includes(mod.id);
          const IconComponent = Icons[mod.iconName] || Icons.CheckCircle2;

          return (
            <div 
              key={mod.id}
              onClick={() => toggleModule(mod.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 relative ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50/60 shadow-sm' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{mod.name}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{mod.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                {isSelected && <Icons.Check className="w-3 h-3" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};