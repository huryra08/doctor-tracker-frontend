// src/components/dashboard/RecentPatients.tsx
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ChartRow } from "@/services/dashboard";

function text(row: ChartRow, keys: string[], fallback = "-") {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v) return v;
    if (typeof v === "number") return String(v);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = v as Record<string, unknown>;
      const nestedValue = nested.name ?? nested.patientName ?? nested.label;
      if (typeof nestedValue === "string" || typeof nestedValue === "number") {
        return String(nestedValue);
      }
    }
  }
  return fallback;
}

function when(row: ChartRow) {
  const raw = text(row, ["createdAt", "date"], "");
  const d = new Date(raw);
  return raw && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "-";
}

export function RecentPatients({ rows, loading }: { rows?: ChartRow[]; loading?: boolean }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent patients</h2>
        <Link href="/patients" className="text-sm font-medium text-brand-dark hover:underline">
          View all patients
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : !rows || rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No patients yet.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Condition</th>
                  <th className="py-2 pr-4 font-medium">Doctor</th>
                  <th className="py-2 font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r, i) => (
                  <tr key={text(r, ["_id", "id"], String(i))}>
                    <td className="py-3 pr-4 font-medium">{text(r, ["name", "patientName"])}</td>
                    <td className="py-3 pr-4">{text(r, ["condition"])}</td>
                    <td className="py-3 pr-4 text-muted">{text(r, ["doctorName", "doctor"])}</td>
                    <td className="py-3 text-muted">{when(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-line sm:hidden">
            {rows.map((r, i) => (
              <li key={text(r, ["_id", "id"], String(i))} className="py-3">
                <p className="font-medium">{text(r, ["name", "patientName"])}</p>
                <p className="text-sm text-muted">
                  {text(r, ["condition"])} - {when(r)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}