import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import type { Task } from "../../types/task";

type Props = {
  task: Task | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({ task, busy, onCancel, onConfirm }: Props) {
  return (
    <Modal open={Boolean(task)} title="Delete this task?" onClose={onCancel}>
      <p className="text-sm text-ink-muted">
        “{task?.title}” will be removed from Supabase. This cannot be undone.
      </p>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Deleting…" : "Delete task"}
        </Button>
      </div>
    </Modal>
  );
}
