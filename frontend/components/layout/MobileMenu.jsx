'use client';

export default function MobileMenu({ isOpen, links, onLinkClick, onLogin, onDemo }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3 shadow-xl">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => onLinkClick(link.id)}
          className="block w-full text-left py-2 text-gray-700 font-medium"
        >
          {link.label}
        </button>
      ))}
      <div className="pt-4 flex flex-col space-y-2">
        <button
          onClick={onLogin}
          className="w-full py-2.5 text-center text-sm font-semibold text-blue-600 border border-blue-600 rounded-xl"
        >
          Login
        </button>
        <button
          onClick={onDemo}
          className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-md"
        >
          Create Demo
        </button>
      </div>
    </div>
  );
}