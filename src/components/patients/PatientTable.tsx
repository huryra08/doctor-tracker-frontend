import { Pencil, Trash2 } from "lucide-react";
import { GenderBadge } from "@/components/patients/GenderBadge";
import { doctorName } from "@/types";
import type { Patient } from "@/types";

type Props = {
  patients: Patient[];
  onEdit: (p: Patient) => void;
  onDelete: (p: Patient) => void;
};

const iconBtn = "rounded-md p-2 text-muted";

export function PatientTable({ patients, onEdit, onDelete }: Props) {
  return (
    <>
      {/* Table on tablet and desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Condition</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {patients.map((p) => (
              <tr key={p._id} className="hover:bg-paper/60">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 tabular-nums">{p.age}</td>
                <td className="px-4 py-3">
                  <GenderBadge gender={p.gender} />
                </td>
                <td className="px-4 py-3">{p.condition}</td>
                <td className="px-4 py-3 text-muted">{doctorName(p.doctor)}</td>
                <td className="px-4 py-3 text-muted">{p.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      className={`${iconBtn} hover:bg-paper hover:text-ink`}
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className={`${iconBtn} hover:bg-danger/10 hover:text-danger`}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards on mobile */}
      <ul className="space-y-3 md:hidden">
        {patients.map((p) => (
          <li key={p._id} className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="mt-0.5 text-sm text-muted">{p.condition}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => onEdit(p)}
                  className={`${iconBtn} hover:bg-paper hover:text-ink`}
                  aria-label={`Edit ${p.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className={`${iconBtn} hover:bg-danger/10 hover:text-danger`}
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <GenderBadge gender={p.gender} />
              <span>{p.age} years</span>
              <span>{doctorName(p.doctor)}</span>
              <span>{p.phone}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}