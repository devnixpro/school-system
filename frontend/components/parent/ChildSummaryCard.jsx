'use client';

import Link from 'next/link';

const money = (n) => Number(n || 0).toLocaleString();

function Stat({ label, value, href }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-200 p-4 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <p className="text-2xl font-semibold text-navy">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </Link>
  );
}

export default function ChildSummaryCard({ child, summary }) {
  const classLine = [child.className, child.section].filter(Boolean).join(' - ');

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <header className="mb-5">
        <h2 className="text-xl font-semibold text-navy">{child.name}</h2>
        <p className="text-sm text-slate-600">
          {classLine || 'Class not assigned'}
          {child.rollNo ? `, Roll no. ${child.rollNo}` : ''}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Attendance"
          value={`${summary.attendancePercentage}%`}
          href="/dashboard/parent/child-attendance"
        />
        <Stat
          label="Fees due"
          value={money(summary.pendingFees)}
          href="/dashboard/parent/child-fees"
        />
        <Stat
          label="Homework due"
          value={summary.homeworkDue}
          href="/dashboard/parent/child-homework"
        />
      </div>
    </section>
  );
}
