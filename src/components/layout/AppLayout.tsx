import { NavLink, Outlet } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/Button";
import { SetupBanner } from "../SetupBanner";
import { cn } from "../../lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", icon: ClipboardList, end: false },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16.5rem_1fr]">
      <header className="flex items-center justify-between border-b border-line bg-sidebar px-4 py-3 text-white lg:hidden">
        <span className="font-display text-lg tracking-wide">Ledger</span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-[#efe8dc] transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="font-display text-2xl text-gold">Ledger</p>
            <p className="mt-0.5 text-xs text-[#b7aea0]">Supabase task CRUD</p>
          </div>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                  isActive ? "bg-white/10 text-gold" : "text-[#d8d0c3] hover:bg-white/5",
                )
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="truncate text-xs text-[#b7aea0]">{user?.email}</p>
          <Button variant="ghost" className="mt-2 w-full justify-start text-[#efe8dc] hover:bg-white/10" onClick={() => void signOut()}>
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="min-w-0">
        <SetupBanner />
        <div className="px-4 py-6 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
