'use client';

import Button from '@/components/ui/Button';
import { useModal } from '@/context/ModalContext';
import DashboardMockup from '@/components/hero-mockup/DashboardMockup';

const TRUST_BADGES = ['No credit card required', 'Free setup', 'Cancel anytime'];

export default function Hero() {
  const { openModal } = useModal();

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-20 hero-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
              <i className="fa-solid fa-shield-halved text-blue-600" />
              <span>Trusted by 500+ Schools Across Pakistan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Simplify School <span className="text-blue-600">Management</span> with{' '}
              <span className="text-blue-600">DevNixEdu</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              A complete school management system to handle admissions, attendance,
              exams, fees, and parent communication—all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon="fa-solid fa-arrow-right text-xs"
                onClick={() => openModal('Create Demo')}
                className="w-full sm:w-auto"
              >
                Create Demo
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => openModal('View Demo')}
                className="w-full sm:w-auto"
              >
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <i className="fa-solid fa-play text-[10px]" />
                </span>
                <span>View Demo</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-gray-500">
              {TRUST_BADGES.map((badge) => (
                <div key={badge} className="flex items-center space-x-1.5">
                  <i className="fa-solid fa-circle-check text-blue-600" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center items-center">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}