"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import type { PatientInput } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Enter the patient's full name"),
  age: z.coerce
    .number({ message: "Enter an age" })
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(130, "Enter a valid age"),
  gender: z.enum(["male", "female"], { message: "Choose a gender" }),
  phone: z.string().min(6, "Enter a valid phone number"),
  condition: z.string().min(2, "Enter the patient's condition"),
});

// What the form fields hold while the user types (age can be a string here)
type FormInput = z.input<typeof schema>;
// What the form gives you after validation passes (age is a number)
type FormOutput = z.output<typeof schema>;

export function PatientForm({
  defaultValues,
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<PatientInput>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (values: PatientInput) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const field =
    "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  const err = (key: keyof FormInput) =>
    errors[key] && (
      <p className="mt-1 text-xs text-danger">{String(errors[key]?.message)}</p>
    );

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input id="name" className={field} {...register("name")} />
        {err("name")}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="mb-1 block text-sm font-medium">
            Age
          </label>
          <input id="age" type="number" inputMode="numeric" className={field} {...register("age")} />
          {err("age")}
        </div>
        <div>
          <label htmlFor="gender" className="mb-1 block text-sm font-medium">
            Gender
          </label>
          <select id="gender" className={field} defaultValue="" {...register("gender")}>
            <option value="" disabled>
              Choose
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {err("gender")}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input id="phone" type="tel" className={field} {...register("phone")} />
        {err("phone")}
      </div>

      <div>
        <label htmlFor="condition" className="mb-1 block text-sm font-medium">
          Condition
        </label>
        <input id="condition" className={field} {...register("condition")} />
        {err("condition")}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}