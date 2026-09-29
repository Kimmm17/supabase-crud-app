import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-dark disabled:opacity-60",
  secondary:
    "bg-paper-2 text-ink border border-line hover:bg-white disabled:opacity-60",
  ghost: "bg-transparent text-ink-muted hover:bg-paper-2 hover:text-ink",
  danger: "bg-[#8f2d24] text-white hover:bg-[#74241d] disabled:opacity-60",
};

export function Button({ variant = "primary", className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
