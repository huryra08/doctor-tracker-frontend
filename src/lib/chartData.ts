import type { ChartRow } from "@/services/dashboard";

export interface Point {
  label: string;
  value: number;
}

const LABEL_KEYS = [
  "label", "name", "doctorName", "doctor", "condition", "gender",
  "specialization", "date", "month", "day", "_id",
];
const VALUE_KEYS = ["value", "count", "total", "patients", "patientCount", "doctors"];

function pickLabel(row: ChartRow): string {
  for (const key of LABEL_KEYS) {
    const v = row[key];
    if (typeof v === "string" && v) return v;
    if (typeof v === "number") return String(v);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = v as Record<string, unknown>;
      const nestedValue = nested.name ?? nested.label ?? nested.date ?? nested.month ?? nested.year;
      if (typeof nestedValue === "string" || typeof nestedValue === "number") {
        return String(nestedValue);
      }
    }
  }
  return "Unknown";
}

function pickValue(row: ChartRow): number {
  for (const key of VALUE_KEYS) {
    const v = row[key];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) {
      return Number(v);
    }
  }
  return 0;
}

/** Convert any list of rows into label and value points. */
export function toPoints(rows: ChartRow[] | undefined): Point[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({ label: pickLabel(row), value: pickValue(row) }));
}

/** Shorten long labels so axes stay readable. */
export function shorten(text: string, max = 14) {
  const clean = text.replace(/^dr\.?\s*/i, "");
  return clean.length > max ? `${clean.slice(0, max - 1)}...` : clean;
}

/** Format 2026-11-04 as Nov 4, and 2026-11 as Nov 2026. Other text is returned as is. */
export function formatDateLabel(label: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(label)) {
    const d = new Date(label);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }
  if (/^\d{4}-\d{2}$/.test(label)) {
    const d = new Date(`${label}-01`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  }
  return label;
}

export const CHART_COLORS = ["#0F766E", "#14B8A6", "#5EEAD4", "#B45309", "#64748B", "#C2410C"];