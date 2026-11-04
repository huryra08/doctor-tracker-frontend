"use client";

import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientForm } from "@/components/patients/PatientForm";
import { PatientCreateForm } from "@/components/patients/PatientCreateForm";
import { PatientListSkeleton } from "@/components/patients/PatientListSkeleton";
import { useListParams } from "@/hooks/useListParams";
import { useSlowLoading } from "@/hooks/useSlowLoading";
import {
  useCreatePatient,
  useDeletePatient,
  usePatientList,
  useUpdatePatient,
} from "@/hooks/usePatients";
import type { Patient, PatientQuery } from "@/types";

const PAGE_SIZE = 10;

function PatientsContent() {
  const { params, setParams, clear } = useListParams();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);

  const query: PatientQuery = {
    page: Number(params.page) || 1,
    limit: PAGE_SIZE,
    search: params.search,
    condition: params.condition,
    gender: params.gender as PatientQuery["gender"],
    doctor: params.doctor,
    from: params.from,
    to: params.to,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as PatientQuery["sortOrder"],
  };

  const { data, isLoading, isError, isFetching, refetch } = usePatientList(query);
  const create = useCreatePatient(() => setAdding(false));
  const update = useUpdatePatient(() => setEditing(null));
  const remove = useDeletePatient(() => setDeleting(null));

  // After 4 seconds of loading, explain that the free server may be waking up
  const slow = useSlowLoading(isLoading);

  const patients = data?.data ?? [];
  const filtered = Boolean(
    params.search ||
      params.condition ||
      params.gender ||
      params.doctor ||
      params.from ||
      params.to
  );

  return (
    <>
      <PageHeader
        title="Patients"
        description={
          data?.meta ? `${data.meta.total} patients in total` : "Find, edit and manage every patient"
        }
        action={
          <Button onClick={() => setAdding(true)}>
            <Plus size={18} />
            Add patient
          </Button>
        }
      />

      <PatientFilters params={params} setParams={setParams} clear={clear} />

      {isLoading && (
        <>
          {slow && (
            <p className="mb-3 text-sm text-muted">
              Waking up the server. This can take up to a minute.
            </p>
          )}
          <PatientListSkeleton />
        </>
      )}

      {isError && (
        <EmptyState
          title="Could not load patients"
          message="Check your connection and try again."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      )}

      {!isLoading && !isError && patients.length === 0 && (
        <EmptyState
          title={filtered ? "No patients match these filters" : "No patients yet"}
          message={
            filtered
              ? "Try a different search or clear the filters."
              : "Add your first patient to start tracking."
          }
          action={
            filtered ? (
              <Button variant="secondary" onClick={clear}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setAdding(true)}>Add patient</Button>
            )
          }
        />
      )}

      {!isError && patients.length > 0 && (
        <div className={isFetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
          <PatientTable patients={patients} onEdit={setEditing} onDelete={setDeleting} />
          <Pagination meta={data?.meta} onPage={(page) => setParams({ page })} />
        </div>
      )}

      <Modal open={adding} title="Add patient" onClose={() => setAdding(false)}>
        <PatientCreateForm
          loading={create.isPending}
          onSubmit={(values) => create.mutate(values)}
          onCancel={() => setAdding(false)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit patient" onClose={() => setEditing(null)}>
        {editing && (
          <PatientForm
            defaultValues={{
              name: editing.name,
              age: editing.age,
              gender: editing.gender,
              phone: editing.phone,
              condition: editing.condition,
            }}
            submitLabel="Save changes"
            loading={update.isPending}
            onSubmit={(values) => update.mutate({ id: editing._id, input: values })}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `Delete ${deleting.name}?` : "Delete patient?"}
        message="This permanently deletes the patient. This cannot be undone."
        loading={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting._id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

// useSearchParams needs a Suspense boundary in the Next.js App Router
export default function PatientsPage() {
  return (
    <Suspense fallback={<PatientListSkeleton />}>
      <PatientsContent />
    </Suspense>
  );
}