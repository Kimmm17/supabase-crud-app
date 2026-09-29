import { supabase } from "./supabase";
import type { Task, TaskInput } from "../types/task";

function asTask(row: Task): Task {
  return row;
}

export async function listTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: input.title.trim(),
      description: input.description.trim() || null,
      status: input.status,
      priority: input.priority,
      due_date: input.due_date || null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return asTask(data as Task);
}

export async function updateTask(id: string, input: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: input.title.trim(),
      description: input.description.trim() || null,
      status: input.status,
      priority: input.priority,
      due_date: input.due_date || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return asTask(data as Task);
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeToTasks(
  userId: string,
  onChange: () => void,
) {
  const channel = supabase
    .channel(`tasks-user-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        onChange();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
