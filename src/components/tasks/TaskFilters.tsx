import { Search } from "lucide-react";
import type { TaskFilters } from "../../types/task";
import { SelectField } from "../ui/Select";

type Props = {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
};

export function TaskFiltersBar({ filters, onChange }: Props) {
  return (
    <div className="grid gap-3 rounded-xl border border-line bg-white p-3 sm:grid-cols-[1fr_10rem_10rem]">
      <label className="relative block">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search title or description"
          className="w-full rounded-lg border border-line bg-paper py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-gold/40"
        />
      </label>
      <SelectField
        label="Status"
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as TaskFilters["status"] })
        }
        options={[
          { value: "all", label: "All statuses" },
          { value: "todo", label: "To do" },
          { value: "in_progress", label: "In progress" },
          { value: "done", label: "Done" },
        ]}
      />
      <SelectField
        label="Priority"
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value as TaskFilters["priority"] })
        }
        options={[
          { value: "all", label: "All priorities" },
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]}
      />
    </div>
  );
}
