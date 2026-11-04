import { Building2, Mail, Phone } from "lucide-react";
import type { Doctor } from "@/types";

function initials(name: string) {
  return name
    .replace(/^dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function DoctorProfile({ doctor, patientCount }: { doctor: Doctor; patientCount?: number }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xl font-semibold text-brand-dark">
          {initials(doctor.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-semibold leading-tight">{doctor.name}</h1>
          <p className="mt-0.5 text-brand-dark">{doctor.specialization}</p>

          <dl className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="shrink-0" />
              <dd className="truncate">{doctor.hospital}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <dd>{doctor.phone}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <dd className="truncate">{doctor.email}</dd>
            </div>
          </dl>
        </div>

        {patientCount !== undefined && (
          <div className="rounded-lg bg-paper px-5 py-3 text-center">
            <p className="text-2xl font-semibold tabular-nums">{patientCount}</p>
            <p className="text-xs text-muted">{patientCount === 1 ? "patient" : "patients"}</p>
          </div>
        )}
      </div>
    </section>
  );
}