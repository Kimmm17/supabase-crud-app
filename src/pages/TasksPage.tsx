import { Plus } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmModal } from "../components/tasks/DeleteConfirmModal";
import { TaskFiltersBar } from "../components/tasks/TaskFilters";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskTable } from "../components/tasks/TaskTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { ToastStack, type ToastKind, type ToastMessage } from "../components/ui/Toast";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../lib/auth";
import type { Task, TaskInput } from "../types/task";

export function TasksPage() {
  const { user } = useAuth();
  const {
    filtered,
    filters,
    setFilters,
    loading,
    mutating,
    error,
    refresh,
    add,
    save,
    remove,
  } = useTasks(user?.id);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function notify(kind: ToastKind, text: string) {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), kind, text }]);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormOpen(true);
  }

  async function handleSubmit(input: TaskInput) {
    if (editing) {
      await save(editing.id, input);
      notify("success", "Task updated in Supabase.");
    } else {
      await add(input);
      notify("success", "Task created in Supabase.");
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    await remove(deleting.id);
    notify("success", "Task deleted.");
    setDeleting(null);
  }

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((t) => t.id !== id))} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-gold-dark">Records</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Tasks</h1>
          <p className="mt-2 text-sm text-ink-muted">Create, search, update, and delete rows stored in Postgres.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Add task
        </Button>
      </div>

      <div className="mt-6">
        <TaskFiltersBar filters={filters} onChange={setFilters} />
      </div>

      {error ? (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[#8f2d24]/30 bg-[#f8e8e6] p-4 text-sm text-[#5c1c17] sm:flex-row sm:items-center sm:justify-between">
          <p>{error}</p>
          <Button variant="secondary" onClick={() => void refresh()}>
            Retry
          </Button>
        </div>
      ) : null}

      {loading ? <Spinner label="Loading tasks from Supabase" /> : null}

      {!loading && filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-xl">No tasks yet</p>
          <p className="mt-2 text-sm text-ink-muted">
            {filters.search || filters.status !== "all" || filters.priority !== "all"
              ? "Nothing matches the current search or filters."
              : "Add your first task to store it in Supabase."}
          </p>
          <Button className="mt-4" onClick={openCreate}>
            Add task
          </Button>
        </div>
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="mt-6">
          <TaskTable tasks={filtered} onEdit={openEdit} onDelete={setDeleting} />
        </div>
      ) : null}

      <Modal
        open={formOpen}
        title={editing ? "Edit task" : "Add task"}
        onClose={() => {
          if (!mutating) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
        wide
      >
        <TaskForm
          initial={editing}
          submitting={mutating}
          onCancel={() => {
            if (!mutating) {
              setFormOpen(false);
              setEditing(null);
            }
          }}
          onSubmit={async (input) => {
            try {
              await handleSubmit(input);
            } catch (err) {
              notify("error", err instanceof Error ? err.message : "Save failed.");
            }
          }}
        />
      </Modal>

      <DeleteConfirmModal
        task={deleting}
        busy={mutating}
        onCancel={() => {
          if (!mutating) setDeleting(null);
        }}
        onConfirm={() => {
          void handleDelete().catch((err) => {
            notify("error", err instanceof Error ? err.message : "Delete failed.");
          });
        }}
      />
    </div>
  );
}
