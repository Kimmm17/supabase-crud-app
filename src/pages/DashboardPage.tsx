import { Link } from "react-router-dom";
import { ClipboardList, CircleCheck, ListTodo, Timer } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useTasks } from "../hooks/useTasks";
import { Spinner } from "../components/ui/Spinner";

export function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading, error } = useTasks(user?.id);

  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.18em] text-gold-dark">Overview</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Your work items live in Supabase Postgres. Counts below are loaded from the authenticated
        user’s rows, protected by Row Level Security.
      </p>

      {loading ? <Spinner label="Loading dashboard" /> : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-[#8f2d24]/30 bg-[#f8e8e6] p-4 text-sm text-[#5c1c17]">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={ClipboardList} label="All tasks" value={counts.total} />
          <Stat icon={ListTodo} label="To do" value={counts.todo} />
          <Stat icon={Timer} label="In progress" value={counts.in_progress} />
          <Stat icon={CircleCheck} label="Done" value={counts.done} />
        </div>
      ) : null}

      <div className="mt-8 rounded-xl border border-dashed border-line bg-white/70 p-6">
        <h2 className="font-display text-xl">Manage records</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Create, edit, search, and delete tasks on the CRUD page.
        </p>
        <Link
          to="/tasks"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-3.5 py-2 text-sm font-medium text-ink hover:bg-gold-dark"
        >
          Open task manager
        </Link>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <Icon size={18} className="text-gold-dark" />
      </div>
      <p className="mt-3 font-display text-3xl">{value}</p>
    </div>
  );
}
