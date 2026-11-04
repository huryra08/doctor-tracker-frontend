"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useDoctorFilterOptions } from "@/hooks/useDoctors";

type Props = {
  params: Record<string, string>;
  setParams: (u: Record<string, string | number | undefined>) => void;
  clear: () => void;
};

const FILTER_KEYS = ["search", "specialization", "hospital", "from", "to", "sortBy", "sortOrder"];

export function DoctorFilters({ params, setParams, clear }: Props) {
  const { data: options } = useDoctorFilterOptions();
  const [text, setText] = useState(params.search ?? "");
  const debounced = useDebounce(text, 400);

  // push the debounced search text into the URL
  useEffect(() => {
    if (debounced !== (params.search ?? "")) setParams({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const active = FILTER_KEYS.some((k) => params[k]);
  const sort = `${params.sortBy ?? "createdAt"}:${params.sortOrder ?? "desc"}`;

  const dateField =
    "rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="mb-5 space-y-3 rounded-xl border border-line bg-white p-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search by name, specialization or hospital"
          aria-label="Search doctors"
          className="w-full rounded-lg border border-line py-2 pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* CONFIRM: key names from GET /doctors/filter-options */}
        <Select
          label="Specialization"
          placeholder="All specializations"
          value={params.specialization ?? ""}
          onChange={(v) => setParams({ specialization: v })}
          options={options?.specializations ?? []}
        />
        <Select
          label="Hospital"
          placeholder="All hospitals"
          value={params.hospital ?? ""}
          onChange={(v) => setParams({ hospital: v })}
          options={options?.hospitals ?? []}
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          From
          <input
            type="date"
            value={params.from ?? ""}
            max={params.to || undefined}
            onChange={(e) => setParams({ from: e.target.value })}
            className={`${dateField} min-w-0 flex-1`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          To
          <input
            type="date"
            value={params.to ?? ""}
            min={params.from || undefined}
            onChange={(e) => setParams({ to: e.target.value })}
            className={`${dateField} min-w-0 flex-1`}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          aria-label="Sort doctors"
          value={sort}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            setParams({ sortBy, sortOrder });
          }}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name A to Z</option>
          <option value="name:desc">Name Z to A</option>
        </select>

        {active && (
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
        )}
      </div>
    </div>
  );
}