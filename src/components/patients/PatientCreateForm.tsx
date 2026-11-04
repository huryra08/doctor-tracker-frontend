// src/components/patients/PatientCreateForm.tsx
"use client";

import { useState } from "react";
import { PatientForm } from "@/components/patients/PatientForm";
import { useDoctorChoices } from "@/hooks/usePatients";
import type { PatientCreateInput, PatientInput } from "@/types";

export function PatientCreateForm({
  loading,
  onSubmit,
  onCancel,
}: {
  loading?: boolean;
  onSubmit: (values: PatientCreateInput) => void;
  onCancel: () => void;
}) {
  const { data: doctors, isLoading } = useDoctorChoices();
  const [doctorId, setDoctorId] = useState("");
  const [showError, setShowError] = useState(false);

  const handle = (values: PatientInput) => {
    if (!doctorId) {
      setShowError(true);
      return;
    }
    onSubmit({ ...values, doctor: doctorId });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="doctor" className="mb-1 block text-sm font-medium">
          Doctor
        </label>
        <select
          id="doctor"
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);
            setShowError(false);
          }}
          disabled={isLoading}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="">{isLoading ? "Loading doctors..." : "Choose a doctor"}</option>
          {(doctors ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {showError && <p className="mt-1 text-xs text-danger">Choose a doctor for this patient</p>}
      </div>

      <PatientForm submitLabel="Add patient" loading={loading} onSubmit={handle} onCancel={onCancel} />
    </div>
  );
}