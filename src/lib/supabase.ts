import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigured =
  url.startsWith("https://") &&
  anonKey.length > 20 &&
  !url.includes("YOUR_PROJECT_REF") &&
  !anonKey.includes("your_anon");

/**
 * Browser client. Uses the anon/publishable key only.
 * RLS in Postgres is what protects data — never ship the service_role key.
 */
export const supabase = createClient(
  url || "https://example.supabase.co",
  anonKey || "public-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
