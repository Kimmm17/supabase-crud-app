import { useEffect, useState, type FormEvent } from "react";
import type { FieldErrors } from "../../lib/utils";
import { validateTask } from "../../lib/utils";
import type { Task, TaskInput } from "../../types/task";
import { Button } from "../ui/Button";
import { TextAreaField, TextField } from "../ui/Input";
import { SelectField } from "../ui/Select";

const emptyForm: TaskInput = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  due_date: "",
};

type Props = {
  initial?: Task | null;
  submitting: boolean;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
};

export function TaskForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<TaskInput>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description ?? "",
        status: initial.status,
        priority: initial.priority,
        due_date: initial.due_date ?? "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial]);

  function update<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateTask(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await onSubmit(form);
  }

  return (
    <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
      <TextField
        label="Title"
        name="title"
        required
        maxLength={200}
        value={form.title}
        error={errors.title}
        onChange={(event) => update("title", event.target.value)}
        placeholder="e.g. Prepare project demo"
      />
      <TextAreaField
        label="Description"
        name="description"
        maxLength={2000}
        value={form.description}
        error={errors.description}
        onChange={(event) => update("description", event.target.value)}
        placeholder="Optional details"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Status"
          name="status"
          value={form.status}
          error={errors.status}
          onChange={(event) => update("status", event.target.value as TaskInput["status"])}
          options={[
            { value: "todo", label: "To do" },
            { value: "in_progress", label: "In progress" },
            { value: "done", label: "Done" },
          ]}
        />
        <SelectField
          label="Priority"
          name="priority"
          value={form.priority}
          error={errors.priority}
          onChange={(event) => update("priority", event.target.value as TaskInput["priority"])}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
        <TextField
          label="Due date"
          name="due_date"
          type="date"
          value={form.due_date}
          error={errors.due_date}
          onChange={(event) => update("due_date", event.target.value)}
        />
      </div>
      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : initial ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
