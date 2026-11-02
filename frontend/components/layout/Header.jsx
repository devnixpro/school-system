'use client';

import { useState, useEffect } from 'react';
import { NAV_LINKS } from '@/data/navigation';
import { useModal } from '@/context/ModalContext';
import { useScrollTo } from '@/hooks/useScrollTo';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import Button from '@/components/ui/Button';

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openModal } = useModal();
  const { scrollToSection } = useScrollTo();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setIsMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isScrolled ? 'bg-white/95 border-gray-200 shadow-sm' : 'bg-white/90 border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-blue-600 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => openModal('Login')}>
            Login
          </Button>
          <Button variant="primary" size="md" onClick={() => openModal('Create Demo')}>
            Create Demo
          </Button>
        </div>

        <button
          onClick={() => setIsMobileOpen((v) => !v)}
          className="md:hidden text-gray-700 p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'} text-xl`} />
        </button>
      </div>

      <MobileMenu
        isOpen={isMobileOpen}
        links={NAV_LINKS}
        onLinkClick={handleNavClick}
        onLogin={() => { setIsMobileOpen(false); openModal('Login'); }}
        onDemo={() => { setIsMobileOpen(false); openModal('Create Demo'); }}
      />
    </header>
  );
}