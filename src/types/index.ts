export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PageMeta;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type Gender = "male" | "female";

// Doctor: fields from POST /doctors body
export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type DoctorInput = Pick<
  Doctor,
  "name" | "specialization" | "hospital" | "phone" | "email"
>;

// Patient: fields from POST /doctors/:id/patients body
export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  condition: string;
  // CONFIRM IN POSTMAN: the list may return doctor as an id string
  // or as a populated object. This type accepts both.
  doctor: string | { _id: string; name: string; specialization?: string };
  createdAt: string;
  updatedAt: string;
}

export type PatientInput = Pick<
  Patient,
  "name" | "age" | "gender" | "phone" | "condition"
>;

// Used when creating a patient from the Patients page
export type PatientCreateInput = PatientInput & { doctor: string };

// Query parameters from your collection
export interface DoctorQuery {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PatientQuery {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  gender?: Gender;
  doctor?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function doctorName(doctor: Patient["doctor"], fallback = "Unassigned") {
  return typeof doctor === "object" && doctor !== null ? doctor.name : fallback;
}