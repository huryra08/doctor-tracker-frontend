"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientService } from "@/services/patients";
import { doctorService } from "@/services/doctors";
import { getErrorMessage } from "@/lib/errors";
import type { PatientCreateInput, PatientInput, PatientQuery } from "@/types";

export function usePatientList(query: PatientQuery) {
  return useQuery({
    queryKey: ["patients", query],
    queryFn: () => patientService.list(query),
    placeholderData: keepPreviousData,
  });
}

export function usePatientFilterOptions() {
  return useQuery({
    queryKey: ["patients", "filter-options"],
    queryFn: patientService.filterOptions,
    staleTime: 5 * 60 * 1000,
  });
}

// Doctors for the "Doctor" filter and the Add patient form.
// limit is capped at 100 by the backend.
export function useDoctorChoices() {
  return useQuery({
    queryKey: ["doctors", "choices"],
    queryFn: () => doctorService.list({ page: 1, limit: 100, sortBy: "name", sortOrder: "asc" }),
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data.map((d) => ({ id: d._id, name: d.name })),
  });
}

function useRefreshAfterChange() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["patients"] });
    qc.invalidateQueries({ queryKey: ["doctors"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };
}

export function useCreatePatient(onDone?: () => void) {
  const refresh = useRefreshAfterChange();
  return useMutation({
    mutationFn: (input: PatientCreateInput) => patientService.create(input),
    onSuccess: () => {
      refresh();
      toast.success("Patient added");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not add the patient.")),
  });
}

export function useUpdatePatient(onDone?: () => void) {
  const refresh = useRefreshAfterChange();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PatientInput> }) =>
      patientService.update(id, input),
    onSuccess: () => {
      refresh();
      toast.success("Patient saved");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not save the patient.")),
  });
}

export function useDeletePatient(onDone?: () => void) {
  const refresh = useRefreshAfterChange();
  return useMutation({
    mutationFn: (id: string) => patientService.remove(id),
    onSuccess: () => {
      refresh();
      toast.success("Patient deleted");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not delete the patient.")),
  });
}