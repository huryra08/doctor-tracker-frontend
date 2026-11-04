import { Skeleton } from "@/components/ui/Skeleton";

export function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
}: {
  label: string;
  value?: number;
  hint?: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-tint text-brand-dark">
          {icon}
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-20" />
      ) : (
        <p className="mt-2 text-3xl font-semibold tabular-nums">{(value ?? 0).toLocaleString()}</p>
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}