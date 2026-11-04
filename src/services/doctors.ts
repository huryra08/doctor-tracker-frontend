import { api } from "@/lib/api";
import type {
  ApiResponse, Doctor, DoctorInput, DoctorQuery, Patient, PatientInput,
} from "@/types";

// Remove empty values so the URL stays clean
const clean = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );

export const doctorService = {
  async list(query: DoctorQuery) {
    const res = await api.get<ApiResponse<Doctor[]>>("/doctors", { params: clean(query) });
    return res.data; // keep meta for pagination
  },
  async filterOptions() {
    const res = await api.get<ApiResponse<{ specializations: string[]; hospitals: string[] }>>(
      "/doctors/filter-options"
    );
    return res.data.data; // CONFIRM key names in Postman
  },
  async get(id: string) {
    const res = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return res.data.data;
  },
  async create(input: DoctorInput) {
    const res = await api.post<ApiResponse<Doctor>>("/doctors", input);
    return res.data.data;
  },
  async update(id: string, input: Partial<DoctorInput>) {
    const res = await api.patch<ApiResponse<Doctor>>(`/doctors/${id}`, input);
    return res.data.data;
  },
  async remove(id: string) {
    // Backend returns 409 if the doctor still has patients
    const res = await api.delete<ApiResponse<null>>(`/doctors/${id}`);
    return res.data;
  },
  async patients(id: string, query: { page?: number; limit?: number } = {}) {
    const res = await api.get<ApiResponse<Patient[]>>(`/doctors/${id}/patients`, {
      params: clean(query),
    });
    return res.data;
  },
  async addPatient(id: string, input: PatientInput) {
    const res = await api.post<ApiResponse<Patient>>(`/doctors/${id}/patients`, input);
    return res.data.data;
  },
  async removePatient(doctorId: string, patientId: string) {
    const res = await api.delete<ApiResponse<null>>(`/doctors/${doctorId}/patients/${patientId}`);
    return res.data;
  },
};