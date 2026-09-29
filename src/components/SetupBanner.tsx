import { supabaseConfigured } from "../lib/supabase";

export function SetupBanner() {
  if (supabaseConfigured) return null;

  return (
    <div className="border-b border-[#8f2d24]/30 bg-[#f8e8e6] px-4 py-3 text-sm text-[#5c1c17]">
      <p className="font-medium">Supabase is not configured yet.</p>
      <p className="mt-1">
        Copy <code className="rounded bg-white px-1">.env.example</code> to{" "}
        <code className="rounded bg-white px-1">.env</code>, add your project URL and{" "}
        <strong>anon</strong> key (never the service_role key), run{" "}
        <code className="rounded bg-white px-1">supabase/schema.sql</code> in the SQL Editor, then
        restart <code className="rounded bg-white px-1">npm run dev</code>.
      </p>
    </div>
  );
}
