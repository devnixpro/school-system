"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
import InvoiceTable from "@/components/admin/InvoiceTable";
import { parentService } from "@/services/parentService";

const money = (n) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0,
}).format(Number(n) || 0);

const COLORS = ["#10B981", "#F59E0B", "#F43F5E"];

function statusOf(fee) {
  const status = String(fee.status || "pending").toLowerCase();
  if (status === "paid") return "paid";
  if (status === "overdue") return "overdue";
  if (fee.dueDate && new Date(fee.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) return "overdue";
  return "pending";
}

export default function ParentChildFeesPage() {
  const [children, setChildren] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [fees, setFees] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingFees, setLoadingFees] = useState(false);
  const [error, setError] = useState("");

  const idOf = (child) => String(child._id || child.id || "");
  const nameOf = (child) => child.name || child.fullName ||
    [child.firstName, child.lastName].filter(Boolean).join(" ") || "Student";

  useEffect(() => {
    let active = true;

    async function loadChildren() {
      setLoadingChildren(true);
      setError("");
      try {
        const items = await parentService.getChildren();
        if (!active) return;
        setChildren(items);
        if (items.length) {
          setLoadingFees(true);
          setSelectedId(idOf(items[0]));
        }
      } catch (err) {
        if (active) setError(err.message || "Unable to load linked children.");
      } finally {
        if (active) setLoadingChildren(false);
      }
    }

    loadChildren();
    return () => { active = false; };
  }, []);

  const child = useMemo(
    () => children.find((item) => idOf(item) === selectedId),
    [children, selectedId]
  );

  const loadFees = useCallback(async () => {
    if (!selectedId) {
      setFees([]);
      return;
    }

    setLoadingFees(true);
    setError("");
    try {
      setFees(await parentService.getFees(selectedId));
    } catch (err) {
      setError(err.message || "Unable to load this child's fee records.");
    } finally {
      setLoadingFees(false);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return undefined;
    let active = true;
    parentService.getFees(selectedId)
      .then((items) => {
        if (active) setFees(items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this child's fee records.");
      })
      .finally(() => {
        if (active) setLoadingFees(false);
      });
    return () => { active = false; };
  }, [selectedId]);

  const counts = useMemo(() => {
    const result = { paid: 0, pending: 0, overdue: 0 };
    fees.forEach((fee) => result[statusOf(fee)]++);
    return result;
  }, [fees]);

  const pendingFees = fees.filter((fee) => statusOf(fee) !== "paid");
  const outstanding = pendingFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
  const collected = fees.filter((fee) => statusOf(fee) === "paid")
    .reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

  const chartData = [
    { name: "Paid", value: counts.paid },
    { name: "Pending", value: counts.pending },
    { name: "Overdue", value: counts.overdue },
  ];

  async function receipt(fee) {
    const id = fee._id || fee.id;
    if (!id) throw new Error("Invoice ID is missing.");
    const blob = await parentService.downloadReceipt(selectedId, id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `receipt-${id}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-7">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">PARENT PORTAL / FAMILY FINANCE</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Children&apos;s fees</h1>
            <p className="mt-2 text-sm text-gray-500">View fee balances and payment records for your linked children.</p>
          </div>
          <button onClick={loadFees} disabled={loadingFees || !selectedId} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50">
            {loadingFees ? "Refreshing..." : "↻ Refresh account"}
          </button>
        </header>

        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><span>{error}</span><button onClick={() => children.length ? loadFees() : window.location.reload()} className="font-bold underline">Retry</button></div>}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-navy">Family accounts</h2>
              <p className="mt-1 text-sm text-gray-500">Choose a child to view their individual account.</p>
            </div>
            {!loadingChildren && <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">{children.length} linked account{children.length === 1 ? "" : "s"}</span>}
          </div>

          {loadingChildren ? (
            <div className="mt-5 flex gap-3">{[1, 2].map((n) => <div key={n} className="h-16 w-48 animate-pulse rounded-xl bg-gray-100" />)}</div>
          ) : children.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <p className="font-semibold text-navy">No linked children found</p>
              <p className="mt-1 text-sm text-gray-500">Contact the school administrator to verify your parent account.</p>
            </div>
          ) : (
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {children.map((item) => {
                const id = idOf(item);
                const active = id === selectedId;
                const name = nameOf(item);
                return (
                  <button key={id} onClick={() => { setSelectedId(id); setFees([]); setLoadingFees(true); setError(""); }} className={`flex min-w-52 items-center gap-3 rounded-xl border p-3.5 text-left transition ${active ? "border-brand bg-blue-50 ring-1 ring-brand" : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50"}`}>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${active ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}>{name.charAt(0).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-navy">{name}</span>
                      <span className="mt-1 block truncate text-xs text-gray-500">{item.rollNumber || item.rollNo || item.registrationNumber || "Student account"}</span>
                    </span>
                    {active && <span className="text-brand">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-xl shadow-blue-500/15 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[38px] border-white/10" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-white/75">{child ? `${nameOf(child)} · PENDING DUES` : "PENDING DUES"}</p>
              <p className="mt-4 break-words text-4xl font-bold tracking-tight sm:text-5xl">{loadingChildren || loadingFees ? "Loading..." : money(outstanding)}</p>
              <p className="mt-3 text-sm text-white/75">{loadingFees ? "Retrieving account records..." : `${pendingFees.length} unpaid invoice${pendingFees.length === 1 ? "" : "s"} · ${counts.paid} paid`}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm lg:min-w-52">
              <p className="text-xs font-medium text-white/70">Total paid</p>
              <p className="mt-2 text-2xl font-bold">{loadingFees ? "—" : money(collected)}</p>
              <p className="mt-1 text-xs text-white/70">Recorded collections</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-navy">Account summary</h2>
            <p className="mt-1 text-sm text-gray-500">Current billing status for {child ? nameOf(child) : "the selected child"}.</p>
            <div className="mt-6 space-y-5">
              {[
                { label: "Paid invoices", value: counts.paid, color: "#10B981" },
                { label: "Pending invoices", value: counts.pending, color: "#F59E0B" },
                { label: "Overdue invoices", value: counts.overdue, color: "#F43F5E" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between gap-3 text-sm"><span className="text-gray-600">{item.label}</span><span className="font-bold text-navy">{loadingFees ? "—" : item.value}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full transition-all" style={{ width: `${fees.length ? item.value / fees.length * 100 : 0}%`, backgroundColor: item.color }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-navy">Invoice distribution</h2>
            <p className="mt-1 text-sm text-gray-500">Paid, pending, and overdue records.</p>
            {loadingFees ? <div className="mt-4 h-56 animate-pulse rounded-xl bg-gray-50" /> : (
              <div className="grid items-center gap-3 sm:grid-cols-[1fr_0.8fr]">
                <div className="relative h-56 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={4} stroke="none">
                        {chartData.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} invoices`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-navy">{fees.length}</span>
                    <span className="text-xs text-gray-500">Invoices</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2 text-gray-600"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />{item.name}</span>
                      <span className="font-bold text-navy">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-navy">{child ? `${nameOf(child)}'s invoice history` : "Invoice history"}</h2>
            <p className="mt-1 text-sm text-gray-500">Review fee details and download receipts.</p>
          </div>
          <InvoiceTable fees={fees} loading={loadingChildren || loadingFees} error={error} onRetry={loadFees} onViewReceipt={receipt} showStudent={false} />
        </section>
      </div>
    </main>
  );
}