"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorService } from "@/services/doctors";
import { getErrorMessage } from "@/lib/errors";
import type { DoctorInput, DoctorQuery } from "@/types";

export function useDoctorList(query: DoctorQuery) {
  return useQuery({
    queryKey: ["doctors", query],
    queryFn: () => doctorService.list(query),
    placeholderData: keepPreviousData, // no flicker when changing page or filter
  });
}

export function useDoctorFilterOptions() {
  return useQuery({
    queryKey: ["doctors", "filter-options"],
    queryFn: doctorService.filterOptions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDoctor(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DoctorInput) => doctorService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Doctor added");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not add the doctor.")),
  });
}

export function useUpdateDoctor(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<DoctorInput> }) =>
      doctorService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor saved");
      onDone?.();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not save the doctor.")),
  });
}

export function useDeleteDoctor(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Doctor deleted");
      onDone?.();
    },
    // The backend answers 409 while the doctor still has patients.
    // getErrorMessage shows the backend's own message in the toast.
    onError: (e) => toast.error(getErrorMessage(e, "Could not delete the doctor.")),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctors", "detail", id],
    queryFn: () => doctorService.get(id),
    enabled: Boolean(id),
  });
}