import { useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/Input";
import { SetupBanner } from "../components/SetupBanner";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <AuthShell title="Sign in" subtitle="Use the same email you registered with Supabase Auth.">
      <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)} noValidate>
        {error ? (
          <p className="rounded-lg border border-[#8f2d24]/30 bg-[#f8e8e6] px-3 py-2 text-sm text-[#5c1c17]">
            {error}
          </p>
        ) : null}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" disabled={submitting || loading}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-ink-muted">
          No account?{" "}
          <Link className="font-medium text-gold-dark underline" to="/signup">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SetupBanner />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="font-display text-2xl text-gold-dark">Ledger</p>
        <h1 className="mt-2 font-display text-3xl">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-ink-muted">{subtitle}</p>
        {children}
        </div>
      </div>
    </div>
  );
}
