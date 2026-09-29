import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type Option = { value: string; label: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: Option[];
};

export function SelectField({ label, error, options, className, id, ...props }: Props) {
  const fieldId = id ?? props.name;
  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <select
        id={fieldId}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-gold/40",
          error ? "border-[#8f2d24]" : "border-line",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-[#8f2d24]">{error}</p> : null}
    </label>
  );
}
