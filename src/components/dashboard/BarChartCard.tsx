"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "./ChartCard";
import { CHART_COLORS, shorten, formatDateLabel, type Point } from "@/lib/chartData";

export function BarChartCard({
  title,
  description,
  points,
  loading,
  error,
  onRetry,
  valueLabel = "Patients",
  dates = false,
  className,
}: {
  title: string;
  description?: string;
  points: Point[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  valueLabel?: string;
  dates?: boolean;
  className?: string;
}) {
  const data = points.map((p) => ({
    ...p,
    short: dates ? formatDateLabel(p.label) : shorten(p.label),
  }));

  return (
    <ChartCard
      title={title}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={data.length === 0}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE3E1" />
          <XAxis dataKey="short" tick={{ fontSize: 12, fill: "#5B6B73" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5B6B73" }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "#E0F2EF" }}
            formatter={(value) => [value, valueLabel]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
            contentStyle={{ borderRadius: 8, border: "1px solid #DCE3E1", fontSize: 13 }}
          />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}