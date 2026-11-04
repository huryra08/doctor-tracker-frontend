"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import { usePatientFilterOptions, useDoctorChoices } from "@/hooks/usePatients";

type Props = {
  params: Record<string, string>;
  setParams: (u: Record<string, string | number | undefined>) => void;
  clear: () => void;
};

const FILTER_KEYS = ["search", "condition", "gender", "doctor", "from", "to", "sortBy", "sortOrder"];

const control =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function PatientFilters({ params, setParams, clear }: Props) {
  const { data: options } = usePatientFilterOptions();
  const { data: doctors } = useDoctorChoices();
  const [text, setText] = useState(params.search ?? "");
  const debounced = useDebounce(text, 400);

  // push the debounced search text into the URL
  useEffect(() => {
    if (debounced !== (params.search ?? "")) setParams({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const active = FILTER_KEYS.some((k) => params[k]);
  const sort = `${params.sortBy ?? "createdAt"}:${params.sortOrder ?? "desc"}`;

  return (
    <div className="mb-5 space-y-3 rounded-xl border border-line bg-white p-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search by patient name or condition"
          aria-label="Search patients"
          className="w-full rounded-lg border border-line py-2 pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* CONFIRM: key name from GET /patients/filter-options */}
        <select
          aria-label="Condition"
          value={params.condition ?? ""}
          onChange={(e) => setParams({ condition: e.target.value })}
          className={control}
        >
          <option value="">All conditions</option>
          {(options?.conditions ?? []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          aria-label="Gender"
          value={params.gender ?? ""}
          onChange={(e) => setParams({ gender: e.target.value })}
          className={control}
        >
          <option value="">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          aria-label="Doctor"
          value={params.doctor ?? ""}
          onChange={(e) => setParams({ doctor: e.target.value })}
          className={`${control} sm:col-span-2 lg:col-span-2`}
        >
          <option value="">All doctors</option>
          {(doctors ?? []).map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          From
          <input
            type="date"
            value={params.from ?? ""}
            max={params.to || undefined}
            onChange={(e) => setParams({ from: e.target.value })}
            className={`${control} min-w-0 flex-1`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          To
          <input
            type="date"
            value={params.to ?? ""}
            min={params.from || undefined}
            onChange={(e) => setParams({ to: e.target.value })}
            className={`${control} min-w-0 flex-1`}
          />
        </label>

        <select
          aria-label="Sort patients"
          value={sort}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            setParams({ sortBy, sortOrder });
          }}
          className={`${control} sm:col-span-2`}
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name A to Z</option>
          <option value="name:desc">Name Z to A</option>
        </select>
      </div>

      {active && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setText("");
              clear();
            }}
          >
            <X size={16} />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}