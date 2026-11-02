'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { MODULES, MODULE_KEYS } from '@/data/modules';
import SectionHeader from '@/components/ui/SectionHeader';

const ModulesSection = forwardRef(function ModulesSection(_, ref) {
  const [activeKey, setActiveKey] = useState('admissions');

  useImperativeHandle(ref, () => ({
    switchTo: (key) => {
      if (MODULES[key]) {
        setActiveKey(key);
        document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }));

  const active = MODULES[activeKey];

  return (
    <section id="modules" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Interactive Modules"
          title="Explore System Modules"
          subtitle="Click below to see how each specialized module operates inside DevNixEdu."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {MODULE_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveKey(key)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeKey === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {MODULES[key].tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              <i className={active.icon} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {active.title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">{active.desc}</p>
            <ul className="space-y-3 text-sm font-medium text-gray-700">
              {active.bullets.map((b) => (
                <li key={b} className="flex items-center space-x-3">
                  <i className="fa-solid fa-check text-blue-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-blue-400">MODULE_PREVIEW.exe</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="bg-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <span>{active.preview.header}</span>
                <span className="text-blue-400">{active.preview.headerRight}</span>
              </div>
              {active.preview.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-700/60 p-2.5 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{item.sub}</div>
                  </div>
                  <span className={statusClasses[item.statusColor]}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ModulesSection;

const statusClasses = {
  amber: 'bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px]',
  emerald: 'bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-[10px]',
  blue: 'bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-[10px]',
};