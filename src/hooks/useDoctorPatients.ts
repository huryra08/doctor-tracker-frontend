"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorService } from "@/services/doctors";
import { getErrorMessage } from "@/lib/errors";
import type { PatientInput } from "@/types";

export function useDoctorPatients(doctorId: string, page: number, limit: number) {
  return useQuery({
    queryKey: ["doctors", doctorId, "patients", { page, limit }],
    queryFn: () => doctorService.patients(doctorId, { page, limit }),
    enabled: Boolean(doctorId),
    placeholderData: keepPreviousData,
  });
}

export function useAddPatient(doctorId: string, onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PatientInput) => doctorService.addPatient(doctorId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors", doctorId, "patients"] });
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient added");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not add the patient.")),
  });
}

export function useRemovePatient(doctorId: string, onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => doctorService.removePatient(doctorId, patientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors", doctorId, "patients"] });
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient removed");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not remove the patient.")),
  });
}