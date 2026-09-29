import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({ open, title, onClose, children, wide }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-xl sm:rounded-2xl ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-xl font-semibold text-ink">
            {title}
          </h2>
          <Button variant="ghost" className="h-8 w-8 px-0" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
