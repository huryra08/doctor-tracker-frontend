import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export function ChartCard({
  title,
  description,
  loading,
  error,
  empty,
  onRetry,
  action,
  className = "",
  children,
}: {
  title: string;
  description?: string;
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  onRetry?: () => void;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-xl border border-line bg-white p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>

      <div className="h-64">
        {loading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted">Could not load this chart.</p>
            {onRetry && (
              <Button variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : empty ? (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No data yet. Add doctors and patients to see this chart.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}