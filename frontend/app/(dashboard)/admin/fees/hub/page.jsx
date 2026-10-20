"use client";

import Link from "next/link";
import {
  IconWallet,
  IconReceipt,
  IconPlus,
  IconChart,
  IconCalendar,
  IconUsers,
  IconArrowLeft,
} from "@/components/common/FeeIcons";

const LINKS = [
  {
    href: "/admin/fees",
    label: "Fee dashboard",
    description: "Analytics, charts, and all invoices at a glance.",
    icon: <IconChart size={20} />,
    tone: "bg-blue-50 text-brand",
  },
  {
    href: "/admin/fees/structure",
    label: "Generate invoices",
    description: "Create new fee invoices for one or many students.",
    icon: <IconPlus size={20} />,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    href: "/admin/fees/invoices",
    label: "All invoices",
    description: "Browse, search, and filter every invoice.",
    icon: <IconReceipt size={20} />,
    tone: "bg-purple-50 text-purple-600",
  },
  {
    href: "/admin/fees/payments",
    label: "Payment history",
    description: "Completed payments grouped by month.",
    icon: <IconWallet size={20} />,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    href: "/student/fees",
    label: "Student view",
    description: "Preview what students see on their fees page.",
    icon: <IconUsers size={20} />,
    tone: "bg-cyan-50 text-cyan-600",
  },
  {
    href: "/parent/child-fees",
    label: "Parent view",
    description: "Preview what parents see for their child's fees.",
    icon: <IconCalendar size={20} />,
    tone: "bg-pink-50 text-pink-600",
  },
];

export default function FeeHubPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/admin/fees"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand mb-6 transition"
        >
          <IconArrowLeft /> Fee Management
        </Link>

        <div className="mb-8">
          <h1 className="text-[32px] leading-tight font-semibold text-navy tracking-tight">
            Fee module
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            Jump to any page in the fee management module.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl border border-gray-200/60 p-6 hover:border-brand hover:shadow-md transition flex items-start gap-4"
            >
              <div className={`w-11 h-11 rounded-xl ${item.tone} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-navy text-[15px]">
                    {item.label}
                  </h2>
                  <span className="text-gray-300 group-hover:text-brand transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}