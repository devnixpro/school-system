'use client';

import { useState } from 'react';
import { useModal } from '@/context/ModalContext';

export default function DemoModal() {
  const { isOpen, type, closeModal } = useModal();
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const title = type === 'Login' ? 'Sign In to Portal' : 'Create Free Demo';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-lg"
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mx-auto font-bold">
            <i className="fa-solid fa-rocket" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">
            Fill in your details and our team will get in touch with you shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="School Name" type="text" placeholder="e.g. Lahore Model Public School" />
          <FormField label="Contact Number" type="tel" placeholder="0300 1234567" />
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Estimated Student Count
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600">
              <option>Less than 200 students</option>
              <option>200 - 500 students</option>
              <option>500 - 1500 students</option>
              <option>1500+ students</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitted}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            {submitted ? '✓ Submitted' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, ...inputProps }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600"
        {...inputProps}
      />
    </div>
  );
}