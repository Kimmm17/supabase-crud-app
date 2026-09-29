import { useEffect } from "react";

export type ToastKind = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  kind: ToastKind;
  text: string;
};

type Props = {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
};

export function ToastStack({ toasts, onDismiss }: Props) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 3800);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const colors =
    toast.kind === "success"
      ? "border-[#2f6b3a] bg-[#e7f3e9] text-[#214a28]"
      : toast.kind === "error"
        ? "border-[#8f2d24] bg-[#f8e8e6] text-[#5c1c17]"
        : "border-line bg-white text-ink";

  return (
    <div className={`pointer-events-auto rounded-lg border px-3 py-2.5 text-sm shadow-md ${colors}`}>
      {toast.text}
    </div>
  );
}
