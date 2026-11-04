"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./ChartCard";
import { CHART_COLORS, type Point } from "@/lib/chartData";

export function PieChartCard({
  title,
  description,
  points,
  loading,
  error,
  onRetry,
  donut = false,
  valueLabel = "Patients",
}: {
  title: string;
  description?: string;
  points: Point[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  donut?: boolean;
  valueLabel?: string;
}) {
  return (
    <ChartCard
      title={title}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={points.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={points}
            dataKey="value"
            nameKey="label"
            innerRadius={donut ? "55%" : 0}
            outerRadius="80%"
            paddingAngle={2}
            stroke="#fff"
          >
            {points.map((p, i) => (
              <Cell key={p.label} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, `${valueLabel}: ${String(name)}`]}
            contentStyle={{ borderRadius: 8, border: "1px solid #DCE3E1", fontSize: 13 }}
          />
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}