import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? props.name;
  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        id={fieldId}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-gold/40",
          error ? "border-[#8f2d24]" : "border-line",
          className,
        )}
        {...props}
      />
      {hint && !error ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-[#8f2d24]">{error}</p> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? props.name;
  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea
        id={fieldId}
        className={cn(
          "min-h-24 w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-gold/40",
          error ? "border-[#8f2d24]" : "border-line",
          className,
        )}
        {...props}
      />
      {hint && !error ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-[#8f2d24]">{error}</p> : null}
    </label>
  );
}
