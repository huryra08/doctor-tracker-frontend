"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarPlus, Stethoscope, UserRoundCheck, Users } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { PieChartCard } from "@/components/dashboard/PieChartCard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { toPoints } from "@/lib/chartData";
import {
  useDoctorsBySpecialization,
  useMonthlyGrowth,
  usePatientsByCondition,
  usePatientsByGender,
  usePatientsDaily,
  usePatientsPerDoctor,
  useRecentPatients,
  useSummary,
} from "@/hooks/useDashboard";

const RANGES = [7, 30, 90] as const;

/** Read a number from the summary using the first key that exists. */
function pick(summary: Record<string, number> | undefined, keys: string[]) {
  if (!summary) return undefined;
  for (const k of keys) {
    if (typeof summary[k] === "number") return summary[k];
  }
  return undefined;
}

function flattenSummary(summary: Record<string, unknown> | undefined): Record<string, number> | undefined {
  if (!summary) return undefined;
  const flattened: Record<string, number> = {};

  for (const [key, value] of Object.entries(summary)) {
    if (typeof value === "number") flattened[key] = value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (typeof nestedValue === "number") {
          flattened[nestedKey] = nestedValue;
        }
      }
    }
  }

  return flattened;
}

export default function DashboardPage() {
  const [days, setDays] = useState<number>(30);

  const summary = useSummary();
  const perDoctor = usePatientsPerDoctor();
  const byCondition = usePatientsByCondition();
  const byGender = usePatientsByGender();
  const bySpecialization = useDoctorsBySpecialization();
  const daily = usePatientsDaily(days);
  const monthly = useMonthlyGrowth(6);
  const recent = useRecentPatients(5);

  const s = flattenSummary(summary.data);
  const dailyPoints = toPoints(daily.data);
  const newInRange = dailyPoints.reduce((sum, p) => sum + p.value, 0);

  const rangeSwitcher = (
    <div className="inline-flex rounded-lg border border-line bg-paper p-0.5" role="group" aria-label="Date range">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => setDays(r)}
          aria-pressed={days === r}
          className={clsx(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            days === r ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
          )}
        >
          {r} days
        </button>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader title="Dashboard" description="A live overview of your doctors and patients" />

      <section className="relative mb-6 overflow-hidden rounded-2xl bg-ink px-5 py-6 text-white sm:px-7 sm:py-7">
        <div className="absolute -right-16 -top-24 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-8 h-32 w-32 rounded-full border border-white/10" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Live practice overview
            </span>
            <h2 className="mt-4 text-xl font-semibold sm:text-2xl">Your care network at a glance</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/70">
              Monitor your doctors, patient records, conditions, and recent activity from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-tint"
            >
              View doctors
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/patients"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View patients
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CONFIRM: summary key names. Several likely names are tried for each card. */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total doctors"
          icon={<Stethoscope size={18} />}
          loading={summary.isLoading}
          value={pick(s, ["totalDoctors", "doctors", "doctorCount"])}
        />
        <StatCard
          label="Total patients"
          icon={<Users size={18} />}
          loading={summary.isLoading}
          value={pick(s, ["totalPatients", "patients", "patientCount"])}
        />
        <StatCard
          label="Patients per doctor"
          hint="Average"
          icon={<UserRoundCheck size={18} />}
          loading={summary.isLoading}
          value={
            pick(s, ["avgPatientsPerDoctor", "averagePatientsPerDoctor"]) ??
            (() => {
              const d = pick(s, ["totalDoctors", "doctors", "doctorCount"]);
              const p = pick(s, ["totalPatients", "patients", "patientCount"]);
              return d && p !== undefined ? Math.round((p / d) * 10) / 10 : undefined;
            })()
          }
        />
        <StatCard
          label={`New patients, last ${days} days`}
          icon={<CalendarPlus size={18} />}
          loading={daily.isLoading}
          value={newInRange}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <LineChartCard
          className="lg:col-span-2"
          title="New patients over time"
          description={`Patients added per day, last ${days} days`}
          points={dailyPoints}
          loading={daily.isLoading}
          error={daily.isError}
          onRetry={() => daily.refetch()}
          action={rangeSwitcher}
        />
        <PieChartCard
          title="Patients by gender"
          points={toPoints(byGender.data)}
          loading={byGender.isLoading}
          error={byGender.isError}
          onRetry={() => byGender.refetch()}
          donut
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <BarChartCard
          title="Patients per doctor"
          description="Doctors with the most patients"
          points={toPoints(perDoctor.data)}
          loading={perDoctor.isLoading}
          error={perDoctor.isError}
          onRetry={() => perDoctor.refetch()}
        />
        <BarChartCard
          title="Monthly growth"
          description="New patients per month, last 6 months"
          points={toPoints(monthly.data)}
          loading={monthly.isLoading}
          error={monthly.isError}
          onRetry={() => monthly.refetch()}
          valueLabel="New patients"
          dates
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <PieChartCard
          title="Patients by condition"
          points={toPoints(byCondition.data)}
          loading={byCondition.isLoading}
          error={byCondition.isError}
          onRetry={() => byCondition.refetch()}
        />
        <BarChartCard
          title="Doctors by specialization"
          points={toPoints(bySpecialization.data)}
          loading={bySpecialization.isLoading}
          error={bySpecialization.isError}
          onRetry={() => bySpecialization.refetch()}
          valueLabel="Doctors"
        />
      </div>

      <div className="mt-4">
        <RecentPatients rows={recent.data} loading={recent.isLoading} />
      </div>
    </>
  );
}