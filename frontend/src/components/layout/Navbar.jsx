"use client";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-navy-100">
      <nav className="container-custom flex items-center justify-between h-16">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 font-poppins font-bold text-navy-900">
          <span className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">D</span>
          DevNixEdu
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><Link href={ROUTES.HOME} className="text-navy-600 hover:text-brand">Home</Link></li>
          <li><Link href={ROUTES.ADMIN_FEES} className="text-navy-600 hover:text-brand">Fees</Link></li>
        </ul>
        <Link href={ROUTES.LOGIN} className="btn-primary !py-2 !px-5 !text-sm">Login</Link>
      </nav>
    </header>
  );
}
