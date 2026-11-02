'use client';

import { useState } from 'react';
import { FAQS } from '@/data/faqs';
import SectionHeader from '@/components/ui/SectionHeader';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Support & Guidance"
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers about setup, security, and migration."
        />

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                onClick={() => toggle(i)}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-center font-bold text-gray-900">
                  <span>{faq.q}</span>
                  <i
                    className={`fa-solid fa-chevron-down text-blue-600 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isOpen && (
                  <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}