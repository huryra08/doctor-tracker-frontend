"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

const STALE = 60 * 1000;

export const useSummary = () =>
  useQuery({ queryKey: ["dashboard", "summary"], queryFn: dashboardService.summary, staleTime: STALE });

export const usePatientsPerDoctor = () =>
  useQuery({
    queryKey: ["dashboard", "patients-per-doctor"],
    queryFn: () => dashboardService.patientsPerDoctor(8),
    staleTime: STALE,
  });

export const usePatientsByCondition = () =>
  useQuery({
    queryKey: ["dashboard", "patients-by-condition"],
    queryFn: dashboardService.patientsByCondition,
    staleTime: STALE,
  });

export const usePatientsByGender = () =>
  useQuery({
    queryKey: ["dashboard", "patients-by-gender"],
    queryFn: dashboardService.patientsByGender,
    staleTime: STALE,
  });

export const useDoctorsBySpecialization = () =>
  useQuery({
    queryKey: ["dashboard", "doctors-by-specialization"],
    queryFn: dashboardService.doctorsBySpecialization,
    staleTime: STALE,
  });

export const usePatientsDaily = (days: number) =>
  useQuery({
    queryKey: ["dashboard", "patients-daily", days],
    queryFn: () => dashboardService.patientsDaily(days),
    staleTime: STALE,
  });

export const useMonthlyGrowth = (months: number) =>
  useQuery({
    queryKey: ["dashboard", "monthly-growth", months],
    queryFn: () => dashboardService.monthlyGrowth(months),
    staleTime: STALE,
  });

export const useRecentPatients = (limit = 5) =>
  useQuery({
    queryKey: ["dashboard", "recent-patients", limit],
    queryFn: () => dashboardService.recentPatients(limit),
    staleTime: STALE,
  });