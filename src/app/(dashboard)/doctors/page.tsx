"use client";

import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { DoctorFilters } from "@/components/doctors/DoctorFilters";
import { DoctorForm } from "@/components/doctors/DoctorForm";
import { DoctorListSkeleton } from "@/components/doctors/DoctorListSkeleton";
import { useListParams } from "@/hooks/useListParams";
import { useSlowLoading } from "@/hooks/useSlowLoading";
import {
  useCreateDoctor,
  useDeleteDoctor,
  useDoctorList,
  useUpdateDoctor,
} from "@/hooks/useDoctors";
import type { Doctor, DoctorQuery } from "@/types";

const PAGE_SIZE = 9;

function DoctorsContent() {
  const { params, setParams, clear } = useListParams();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);

  const query: DoctorQuery = {
    page: Number(params.page) || 1,
    limit: PAGE_SIZE,
    search: params.search,
    specialization: params.specialization,
    hospital: params.hospital,
    from: params.from,
    to: params.to,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as DoctorQuery["sortOrder"],
  };

  const { data, isLoading, isError, isFetching, refetch } = useDoctorList(query);
  const create = useCreateDoctor(() => setAdding(false));
  const update = useUpdateDoctor(() => setEditing(null));
  const remove = useDeleteDoctor(() => setDeleting(null));

  // After 4 seconds of loading, explain that the free server may be waking up
  const slow = useSlowLoading(isLoading);

  const doctors = data?.data ?? [];
  const filtered = Boolean(
    params.search || params.specialization || params.hospital || params.from || params.to
  );

  return (
    <>
      <PageHeader
        title="Doctors"
        description={
          data?.meta ? `${data.meta.total} doctors in total` : "Manage doctors and see their patients"
        }
        action={
          <Button onClick={() => setAdding(true)}>
            <Plus size={18} />
            Add doctor
          </Button>
        }
      />

      <DoctorFilters params={params} setParams={setParams} clear={clear} />

      {isLoading && (
        <>
          {slow && (
            <p className="mb-3 text-sm text-muted">
              Waking up the server. This can take up to a minute.
            </p>
          )}
          <DoctorListSkeleton />
        </>
      )}

      {isError && (
        <EmptyState
          title="Could not load doctors"
          message="Check your connection and try again."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      )}

      {!isLoading && !isError && doctors.length === 0 && (
        <EmptyState
          title={filtered ? "No doctors match these filters" : "No doctors yet"}
          message={
            filtered
              ? "Try a different search or clear the filters."
              : "Add your first doctor to start tracking patients."
          }
          action={
            filtered ? (
              <Button variant="secondary" onClick={clear}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setAdding(true)}>Add doctor</Button>
            )
          }
        />
      )}

      {!isError && doctors.length > 0 && (
        <div className={isFetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d._id} doctor={d} onEdit={setEditing} onDelete={setDeleting} />
            ))}
          </div>
          <Pagination meta={data?.meta} onPage={(page) => setParams({ page })} />
        </div>
      )}

      <Modal open={adding} title="Add doctor" onClose={() => setAdding(false)}>
        <DoctorForm
          submitLabel="Add doctor"
          loading={create.isPending}
          onSubmit={(values) => create.mutate(values)}
          onCancel={() => setAdding(false)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit doctor" onClose={() => setEditing(null)}>
        {editing && (
          <DoctorForm
            defaultValues={{
              name: editing.name,
              specialization: editing.specialization,
              hospital: editing.hospital,
              phone: editing.phone,
              email: editing.email,
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
        title={deleting ? `Delete ${deleting.name}?` : "Delete doctor?"}
        message="This cannot be undone. A doctor who still has patients cannot be deleted, so remove or move their patients first."
        loading={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting._id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

// useSearchParams needs a Suspense boundary in the Next.js App Router
export default function DoctorsPage() {
  return (
    <Suspense fallback={<DoctorListSkeleton />}>
      <DoctorsContent />
    </Suspense>
  );
}