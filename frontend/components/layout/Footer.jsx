'use client';

import Logo from './Logo';
import { NAV_LINKS } from '@/data/navigation';
import { MODULES } from '@/data/modules';
import { useScrollTo } from '@/hooks/useScrollTo';

const CONTACT = [
  { icon: 'fa-solid fa-phone', text: '+92 319 8018471' },
  { icon: 'fa-solid fa-envelope', text: 'support@devnixedu.com' },
  { icon: 'fa-solid fa-location-dot', text: 'Lahore & Karachi, Pakistan' },
];

export default function Footer({ onModuleClick }) {
  const { scrollToSection } = useScrollTo();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="text-slate-400 text-sm">
            Empowering schools across Pakistan with next-generation management tools,
            automated fees, and smart parent communication.
          </p>
        </div>

        <FooterColumn title="Quick Links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="hover:text-white transition-colors text-left"
            >
              {link.label}
            </button>
          ))}
        </FooterColumn>

        <FooterColumn title="Modules">
          {Object.entries(MODULES).map(([key, mod]) => (
            <button
              key={key}
              onClick={() => onModuleClick?.(key)}
              className="hover:text-white transition-colors text-left"
            >
              {mod.title.split('&')[0].trim()}
            </button>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact Us">
          {CONTACT.map((item, i) => (
            <div key={i} className="flex items-start">
              <i className={`${item.icon} mr-2 text-blue-500 mt-1`} />
              <span>{item.text}</span>
            </div>
          ))}
        </FooterColumn>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} DevNixEdu Smart School Management System. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-blue-400">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-slate-400 flex flex-col">{children}</ul>
    </div>
  );
}