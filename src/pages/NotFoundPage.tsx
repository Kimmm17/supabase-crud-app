import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="font-display text-5xl text-gold-dark">404</p>
      <h1 className="mt-2 font-display text-2xl">Page not found</h1>
      <Link className="mt-4 text-sm text-gold-dark underline" to="/">
        Back to dashboard
      </Link>
    </div>
  );
}
