import { useCallback, useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, listTasks, subscribeToTasks, updateTask } from "../lib/tasks";
import { toErrorMessage } from "../lib/utils";
import type { Task, TaskFilters, TaskInput } from "../types/task";

const emptyFilters: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
};

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setError(null);
    try {
      const rows = await listTasks();
      setTasks(rows);
    } catch (err) {
      setError(toErrorMessage(err, "Could not load tasks from Supabase."));
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    listTasks()
      .then((rows) => {
        if (!cancelled) setTasks(rows);
      })
      .catch((err) => {
        if (!cancelled) setError(toErrorMessage(err, "Could not load tasks from Supabase."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const unsubscribe = subscribeToTasks(userId, () => {
      void refresh();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [userId, refresh]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description ?? "").toLowerCase().includes(q);
      const matchesStatus = filters.status === "all" || task.status === filters.status;
      const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  async function add(input: TaskInput) {
    if (!userId) throw new Error("You must be signed in.");
    setMutating(true);
    setError(null);
    try {
      const created = await createTask(userId, input);
      setTasks((current) => [created, ...current.filter((t) => t.id !== created.id)]);
      return created;
    } catch (err) {
      const message = toErrorMessage(err, "Could not create the task.");
      setError(message);
      throw new Error(message);
    } finally {
      setMutating(false);
    }
  }

  async function save(id: string, input: TaskInput) {
    setMutating(true);
    setError(null);
    try {
      const updated = await updateTask(id, input);
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
      return updated;
    } catch (err) {
      const message = toErrorMessage(err, "Could not update the task.");
      setError(message);
      throw new Error(message);
    } finally {
      setMutating(false);
    }
  }

  async function remove(id: string) {
    setMutating(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      const message = toErrorMessage(err, "Could not delete the task.");
      setError(message);
      throw new Error(message);
    } finally {
      setMutating(false);
    }
  }

  return {
    tasks,
    filtered,
    filters,
    setFilters,
    loading,
    mutating,
    error,
    setError,
    refresh,
    add,
    save,
    remove,
  };
}
