"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Award, Loader2 } from 'lucide-react';
import SubjectCard from '@/components/student/syllabus/SubjectCard'; 
import ModuleAccordion from '@/components/student/syllabus/ModuleAccordion';
import api from '@/services/api'; // Aapka custom api service

export default function SyllabusPage() {
  const [subjectsData, setSubjectsData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Custom api service ka use karte huay GET request
        const response = await api.get('/syllabus');
        
        // Axios ya custom wrapper aksar data ko 'response.data' mein rakhte hain
        const result = response.data || response;
        
        // Check karein ke data array hai ya success property ke andar hai
        const dataList = result.data || result;

        if (Array.isArray(dataList) && dataList.length > 0) {
          setSubjectsData(dataList);
          setSelectedSubject(dataList[0]);
          
          if (dataList[0].modules && dataList[0].modules.length > 0) {
            const firstModId = dataList[0].modules[0]._id || dataList[0].modules[0].id || 0;
            setExpandedModules({ [firstModId]: true });
          }
        } else {
          setError('No syllabus data found in database.');
        }
      } catch (err) {
        console.error('Error fetching syllabus:', err);
        setError(err.response?.data?.message || 'Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-indigo-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2 font-medium text-slate-700">Loading Syllabus...</span>
      </div>
    );
  }

  if (error || !selectedSubject) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-600 font-semibold mb-2">{error || 'Data is not loading'}</p>
        <p className="text-slate-500 text-sm">Please check your backend API service or route.</p>
      </div>
    );
  }

  const selectedSubId = selectedSubject._id || selectedSubject.id;

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Course Syllabus
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Check your subject syllabus 
          </p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm w-fit">
          <Download className="w-4 h-4" />
          Download Full Syllabus (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Select Subject</h2>
            
            <div className="space-y-2">
              {subjectsData.map((subj) => {
                const subId = subj._id || subj.id;
                return (
                  <SubjectCard
                    key={subId}
                    subject={subj}
                    isSelected={selectedSubId === subId}
                    onClick={() => {
                      setSelectedSubject(subj);
                      if (subj.modules && subj.modules.length > 0) {
                        const modId = subj.modules[0]._id || subj.modules[0].id || 0;
                        setExpandedModules({ [modId]: true });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <h3 className="font-semibold text-sm">Instructor Details</h3>
            </div>
            <p className="text-sm text-slate-300">{selectedSubject.instructor || 'N/A'}</p>
            <p className="text-xs text-slate-400 mt-2">
              Completion Target: 100% by Semester End.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Syllabus Topics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                {selectedSubject.code}
              </span>
              <h2 className="text-xl font-bold text-slate-900">{selectedSubject.name}</h2>
              <p className="text-xs text-slate-500 mt-1">Instructor: {selectedSubject.instructor || 'N/A'}</p>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
              <span className="text-2xl font-bold text-indigo-600">{selectedSubject.progress || 0}%</span>
              <p className="text-xs text-slate-400">Total Progress</p>
            </div>
          </div>

          {/* Modules List */}
          <div className="space-y-3">
            {selectedSubject.modules?.map((module, index) => {
              const modKey = module._id || module.id || index;
              return (
                <ModuleAccordion
                  key={modKey}
                  module={module}
                  isExpanded={expandedModules[modKey]}
                  onToggle={() => toggleModule(modKey)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}