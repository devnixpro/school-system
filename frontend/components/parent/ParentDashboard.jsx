'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parentService } from '@/services/parentService';

const money = (amount) => new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
}).format(Number(amount) || 0);

const LINKS = [
  { href: '/parent/child-attendance', label: 'Attendance' },
  { href: '/parent/child-fees', label: 'Fees' },
  { href: '/parent/child-results', label: 'Results' },
  { href: '/parent/child-homework', label: 'Homework' },
];

export default function ParentDashboard() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('Parent');

  const fetchDashboard = useCallback(async () => {
    const linkedChildren = await parentService.getChildren();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const entries = await Promise.all(
        linkedChildren.map(async (child) => [
          child._id,
          await parentService.getSummary(child._id),
        ])
      );
    return {
      children: linkedChildren,
      summaries: Object.fromEntries(entries),
      userName: user.name || 'Parent',
    };
  }, []);

  const handleLoadError = useCallback((requestError) => {
    if (requestError.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.replace('/login');
      return;
    }
    setError(requestError.response?.data?.message || requestError.message || 'Unable to load the parent dashboard.');
  }, [router]);

  const loadDashboard = async () => {
    try {
      const dashboard = await fetchDashboard();
      setChildren(dashboard.children);
      setSummaries(dashboard.summaries);
      setUserName(dashboard.userName);
    } catch (requestError) {
      handleLoadError(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchDashboard()
      .then((dashboard) => {
        if (!active) return;
        setChildren(dashboard.children);
        setSummaries(dashboard.summaries);
        setUserName(dashboard.userName);
      })
      .catch((requestError) => {
        if (active) handleLoadError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [fetchDashboard, handleLoadError]);

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('parent:selectedChild');
    router.replace('/login');
  };

  const retryDashboard = () => {
    setLoading(true);
    setError('');
    loadDashboard();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Parent portal</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Welcome, {userName}</h1>
            <p className="mt-2 text-sm text-slate-600">View your linked children&apos;s school information.</p>
          </div>
          <button onClick={signOut} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Sign out
          </button>
        </header>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={retryDashboard} className="font-semibold underline">Try again</button>
          </div>
        )}

        {loading ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">Loading your children&apos;s information...</p>
        ) : children.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">No children linked yet</h2>
            <p className="mt-2 text-sm text-slate-600">Please contact your school administrator to link your child to this account.</p>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2">
            {children.map((child) => {
              const summary = summaries[child._id];
              return (
                <article key={child._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{child.name}</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {[child.class, child.section && `Section ${child.section}`].filter(Boolean).join(' · ') || 'Class not assigned'}
                        {child.rollNumber ? ` · Roll ${child.rollNumber}` : ''}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {child.school?.name || 'School'}
                    </span>
                  </div>

                  {summary ? (
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Attendance</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{summary.attendancePercentage}%</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Fees due</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{money(summary.pendingFees)}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Homework</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{summary.homeworkDue}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-slate-500">Loading child summary...</p>
                  )}

                  <nav aria-label={`${child.name} details`} className="mt-5 flex flex-wrap gap-2">
                    {LINKS.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => localStorage.setItem('parent:selectedChild', child._id)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
