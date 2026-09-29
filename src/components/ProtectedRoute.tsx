import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabaseConfigured } from "../lib/supabase";
import { Spinner } from "./ui/Spinner";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!supabaseConfigured) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-paper">
        <Spinner label="Checking session" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
