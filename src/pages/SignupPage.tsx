import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/Input";
import { useAuth } from "../lib/auth";
import { AuthShell } from "./LoginPage";

export function SignupPage() {
  const { user, loading, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const result = await signUp(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setInfo("Account created. Confirm the email Supabase sent, then sign in.");
    }
  }

  async function onGoogleSignIn() {
    setError(null);
    setSubmitting(true);
    const result = await signInWithGoogle();
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <AuthShell title="Create account" subtitle="New users are stored in Supabase Auth. Tasks stay private via RLS.">
      <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)} noValidate>
        {error ? (
          <p className="rounded-lg border border-[#8f2d24]/30 bg-[#f8e8e6] px-3 py-2 text-sm text-[#5c1c17]">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-lg border border-[#2f6b3a]/30 bg-[#e7f3e9] px-3 py-2 text-sm text-[#214a28]">
            {info}
          </p>
        ) : null}
        <Button type="button" variant="secondary" disabled={submitting || loading} onClick={() => void onGoogleSignIn()}>
          <span aria-hidden="true" className="font-semibold text-[#4285f4]">G</span>
          Continue with Google
        </Button>
        <p className="text-center text-xs text-ink-muted">or create an account with email</p>
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <TextField
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          required
        />
        <Button type="submit" disabled={submitting || loading}>
          {submitting ? "Creating…" : "Sign up"}
        </Button>
        <p className="text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link className="font-medium text-gold-dark underline" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
