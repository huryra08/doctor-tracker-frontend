import { api } from "@/lib/api";
import type {
  ApiResponse, Patient, PatientCreateInput, PatientInput, PatientQuery,
} from "@/types";

const clean = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );

export const patientService = {
  async list(query: PatientQuery) {
    const res = await api.get<ApiResponse<Patient[]>>("/patients", { params: clean(query) });
    return res.data;
  },
  async filterOptions() {
    const res = await api.get<ApiResponse<{ conditions: string[] }>>("/patients/filter-options");
    return res.data.data; // CONFIRM key name in Postman
  },
  async get(id: string) {
    const res = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return res.data.data;
  },
  async create(input: PatientCreateInput) {
    const res = await api.post<ApiResponse<Patient>>("/patients", input);
    return res.data.data;
  },
  async update(id: string, input: Partial<PatientInput>) {
    const res = await api.patch<ApiResponse<Patient>>(`/patients/${id}`, input);
    return res.data.data;
  },
  async remove(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/patients/${id}`);
    return res.data;
  },
};