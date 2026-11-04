import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

// Temporary loose types. Replace with exact types once real responses are known.
export type ChartRow = Record<string, unknown>;
export type Summary = Record<string, number>;

function unwrapPayload<T>(payload: unknown): T {
  let value = payload;
  const containerKeys = ["data", "summary", "stats", "rows", "results", "items"];

  for (let depth = 0; depth < 5 && value && typeof value === "object"; depth++) {
    const record = value as Record<string, unknown>;
    const nextKey = containerKeys.find(
      (key) => key in record && record[key] !== null && typeof record[key] === "object"
    );
    if (!nextKey) break;
    value = record[nextKey];
  }

  return value as T;
}

const get = async <T>(path: string, params?: Record<string, number>) => {
  const res = await api.get<ApiResponse<T>>(`/dashboard/${path}`, { params });
  return unwrapPayload<T>(res.data);
};

export const dashboardService = {
  summary: () => get<Summary>("summary"),
  patientsPerDoctor: (limit = 10) => get<ChartRow[]>("patients-per-doctor", { limit }),
  patientsByCondition: () => get<ChartRow[]>("patients-by-condition"),
  patientsByGender: () => get<ChartRow[]>("patients-by-gender"),
  doctorsBySpecialization: () => get<ChartRow[]>("doctors-by-specialization"),
  patientsDaily: (days = 30) => get<ChartRow[]>("patients-daily", { days }),
  monthlyGrowth: (months = 6) => get<ChartRow[]>("monthly-growth", { months }),
  recentPatients: (limit = 5) => get<ChartRow[]>("recent-patients", { limit }),
};