"use client";

import { useEffect, useState } from "react";
import FeeStatCards from "./FeeStatCards";
import MonthlyCollectionChart from "./MonthlyCollectionChart";
import FeeTypeSummaryTable from "./FeeTypeSummaryTable";
import FeeAnalyticsSkeleton from "./FeeAnalyticsSkeleton";
import { feeService } from "@/services/feeService";

/**
 * Fetches analytics from feeService. Falls back to mock data on error
 * so the dashboard always renders during development.
 */
export default function FeeAnalyticsSection() {
  const [state, setState] = useState({
    loading: true,
    stats: null,
    monthly: null,
    byType: null,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [statsRes, monthlyRes, byTypeRes] = await Promise.allSettled([
          feeService.analytics(),
          typeof feeService.monthly === "function" ? feeService.monthly() : Promise.resolve({ data: null }),
          typeof feeService.byType === "function" ? feeService.byType() : Promise.resolve({ data: null }),
        ]);

        if (!mounted) return;

        setState({
          loading: false,
          stats: statsRes.status === "fulfilled" ? statsRes.value?.data : null,
          monthly: monthlyRes.status === "fulfilled" ? monthlyRes.value?.data : null,
          byType: byTypeRes.status === "fulfilled" ? byTypeRes.value?.data : null,
        });
      } catch {
        if (mounted) setState((s) => ({ ...s, loading: false }));
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <FeeAnalyticsSkeleton />;

  return (
    <div className="space-y-5">
      <FeeStatCards data={state.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MonthlyCollectionChart data={state.monthly} />
        <FeeTypeSummaryTable rows={state.byType} />
      </div>
    </div>
  );
}