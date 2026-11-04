"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { DoctorProfile } from "@/components/doctors/DoctorProfile";
import { PatientForm } from "@/components/patients/PatientForm";
import { GenderBadge } from "@/components/patients/GenderBadge";
import { useDoctor } from "@/hooks/useDoctors";
import { useAddPatient, useDoctorPatients, useRemovePatient } from "@/hooks/useDoctorPatients";
import type { Patient } from "@/types";

const PAGE_SIZE = 8;

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Patient | null>(null);

  const doctor = useDoctor(id);
  const patients = useDoctorPatients(id, page, PAGE_SIZE);
  const add = useAddPatient(id, () => setAdding(false));
  const remove = useRemovePatient(id, () => setRemoving(null));

  const list = patients.data?.data ?? [];
  const meta = patients.data?.meta;

  if (doctor.isError) {
    return (
      <EmptyState
        title="Doctor not found"
        message="This doctor may have been deleted, or the link is wrong."
        action={
          <Link href="/doctors">
            <Button>Back to doctors</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Link
        href="/doctors"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={16} />
        All doctors
      </Link>

      {doctor.isLoading || !doctor.data ? (
        <Skeleton className="h-36 w-full rounded-xl" />
      ) : (
        <DoctorProfile doctor={doctor.data} patientCount={meta?.total} />
      )}

      <div className="mb-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Patients</h2>
        <Button onClick={() => setAdding(true)}>
          <Plus size={18} />
          Add patient
        </Button>
      </div>

      {patients.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {patients.isError && (
        <EmptyState
          title="Could not load patients"
          message="Check your connection and try again."
          action={<Button onClick={() => patients.refetch()}>Retry</Button>}
        />
      )}

      {!patients.isLoading && !patients.isError && list.length === 0 && (
        <EmptyState
          title="No patients yet"
          message="Add the first patient under this doctor."
          action={<Button onClick={() => setAdding(true)}>Add patient</Button>}
        />
      )}

      {list.length > 0 && (
        <div className={patients.isFetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
          {/* Table on tablet and desktop */}
          <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Gender</th>
                  <th className="px-4 py-3 font-medium">Condition</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((p) => (
                  <tr key={p._id} className="hover:bg-paper/60">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 tabular-nums">{p.age}</td>
                    <td className="px-4 py-3">
                      <GenderBadge gender={p.gender} />
                    </td>
                    <td className="px-4 py-3">{p.condition}</td>
                    <td className="px-4 py-3 text-muted">{p.phone}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setRemoving(p)}
                        className="rounded-md p-2 text-muted hover:bg-danger/10 hover:text-danger"
                        aria-label={`Remove ${p.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stacked cards on mobile */}
          <ul className="space-y-3 md:hidden">
            {list.map((p) => (
              <li key={p._id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{p.condition}</p>
                  </div>
                  <button
                    onClick={() => setRemoving(p)}
                    className="rounded-md p-2 text-muted hover:bg-danger/10 hover:text-danger"
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <GenderBadge gender={p.gender} />
                  <span>{p.age} years</span>
                  <span>{p.phone}</span>
                </div>
              </li>
            ))}
          </ul>

          <Pagination meta={meta} onPage={setPage} />
        </div>
      )}

      <Modal open={adding} title={`Add patient for ${doctor.data?.name ?? "this doctor"}`} onClose={() => setAdding(false)}>
        <PatientForm
          submitLabel="Add patient"
          loading={add.isPending}
          onSubmit={(values) => add.mutate(values)}
          onCancel={() => setAdding(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!removing}
        title={removing ? `Remove ${removing.name}?` : "Remove patient?"}
        message="This removes the patient from this doctor's list. This cannot be undone."
        confirmLabel="Remove"
        loading={remove.isPending}
        onConfirm={() => removing && remove.mutate(removing._id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}