import Link from "next/link";
import { Building2, Mail, Pencil, Phone, Trash2, Users } from "lucide-react";
import type { Doctor } from "@/types";

function initials(name: string) {
  return name
    .replace(/^dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}: {
  doctor: Doctor;
  onEdit: (d: Doctor) => void;
  onDelete: (d: Doctor) => void;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand-dark">
          {initials(doctor.name)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{doctor.name}</h3>
          <p className="truncate text-sm text-brand-dark">{doctor.specialization}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="shrink-0" />
          <dd className="truncate">{doctor.hospital}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="shrink-0" />
          <dd>{doctor.phone}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} className="shrink-0" />
          <dd className="truncate">{doctor.email}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <Link
          href={`/doctors/${doctor._id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:underline"
        >
          <Users size={16} />
          View patients
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(doctor)}
            className="rounded-md p-2 text-muted hover:bg-paper hover:text-ink"
            aria-label={`Edit ${doctor.name}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(doctor)}
            className="rounded-md p-2 text-muted hover:bg-danger/10 hover:text-danger"
            aria-label={`Delete ${doctor.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}