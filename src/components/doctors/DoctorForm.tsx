"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import type { DoctorInput } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Enter the doctor's full name"),
  specialization: z.string().min(2, "Enter a specialization"),
  hospital: z.string().min(2, "Enter a hospital"),
  phone: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
});

export function DoctorForm({
  defaultValues,
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<DoctorInput>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (values: DoctorInput) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorInput>({ resolver: zodResolver(schema), defaultValues });

  const field = "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  const rows: { name: keyof DoctorInput; label: string; type?: string }[] = [
    { name: "name", label: "Full name" },
    { name: "specialization", label: "Specialization" },
    { name: "hospital", label: "Hospital" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "email", label: "Email", type: "email" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {rows.map((r) => (
        <div key={r.name}>
          <label htmlFor={r.name} className="mb-1 block text-sm font-medium">{r.label}</label>
          <input id={r.name} type={r.type ?? "text"} className={field} {...register(r.name)} />
          {errors[r.name] && <p className="mt-1 text-xs text-danger">{errors[r.name]?.message}</p>}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}