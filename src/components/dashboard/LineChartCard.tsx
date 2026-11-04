"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./ChartCard";
import { CHART_COLORS, formatDateLabel, type Point } from "@/lib/chartData";

export function LineChartCard({
  title,
  description,
  points,
  loading,
  error,
  onRetry,
  action,
  className,
}: {
  title: string;
  description?: string;
  points: Point[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  action?: React.ReactNode;
  className?: string;
}) {
  const data = points.map((p) => ({ ...p, short: formatDateLabel(p.label) }));

  return (
    <ChartCard
      title={title}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={data.length === 0}
      action={action}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE3E1" />
          <XAxis dataKey="short" tick={{ fontSize: 12, fill: "#5B6B73" }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5B6B73" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value) => [value, "New patients"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
            contentStyle={{ borderRadius: 8, border: "1px solid #DCE3E1", fontSize: 13 }}
          />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}