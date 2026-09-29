import { Pencil, Trash2 } from "lucide-react";
import { formatDate, priorityLabel, statusLabel } from "../../lib/utils";
import type { Task } from "../../types/task";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function statusTone(status: Task["status"]) {
  if (status === "done") return "green" as const;
  if (status === "in_progress") return "gold" as const;
  return "neutral" as const;
}

function priorityTone(priority: Task["priority"]) {
  if (priority === "high") return "red" as const;
  if (priority === "medium") return "gold" as const;
  return "neutral" as const;
}

export function TaskTable({ tasks, onEdit, onDelete }: Props) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-2 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{task.title}</p>
                  {task.description ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{task.description}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(task.status)}>{statusLabel(task.status)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={priorityTone(task.priority)}>{priorityLabel(task.priority)}</Badge>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(task.due_date)}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(task.updated_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {tasks.map((task) => (
          <article key={task.id} className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">{task.title}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" className="h-8 w-8 px-0" onClick={() => onEdit(task)}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" className="h-8 w-8 px-0" onClick={() => onDelete(task)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            {task.description ? <p className="mt-1 text-sm text-ink-muted">{task.description}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={statusTone(task.status)}>{statusLabel(task.status)}</Badge>
              <Badge tone={priorityTone(task.priority)}>{priorityLabel(task.priority)}</Badge>
              <span className="text-xs text-ink-muted">Due {formatDate(task.due_date)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
