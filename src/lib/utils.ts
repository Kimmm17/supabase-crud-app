import type { TaskInput } from "../types/task";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types/task";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  switch (status) {
    case "todo":
      return "To do";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

export function priorityLabel(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export type FieldErrors = Partial<Record<keyof TaskInput, string>>;

export function validateTask(input: TaskInput): FieldErrors {
  const errors: FieldErrors = {};
  const title = input.title.trim();

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > 200) {
    errors.title = "Title must be 200 characters or fewer.";
  }

  if (input.description.length > 2000) {
    errors.description = "Description must be 2000 characters or fewer.";
  }

  if (!TASK_STATUSES.includes(input.status)) {
    errors.status = "Choose a valid status.";
  }

  if (!TASK_PRIORITIES.includes(input.priority)) {
    errors.priority = "Choose a valid priority.";
  }

  if (input.due_date) {
    const due = new Date(`${input.due_date}T00:00:00`);
    if (Number.isNaN(due.getTime())) {
      errors.due_date = "Enter a valid due date.";
    }
  }

  return errors;
}

export function toErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: unknown }).message);
    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      return "Could not reach Supabase. Check your connection and project URL.";
    }
    if (message.includes("JWT") || message.toLowerCase().includes("not authenticated")) {
      return "Your session expired. Please sign in again.";
    }
    return message;
  }
  return fallback;
}
