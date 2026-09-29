import { cn } from "../../lib/utils";

type Props = {
  tone?: "neutral" | "gold" | "green" | "red";
  children: string;
};

const tones = {
  neutral: "bg-paper-2 text-ink-muted",
  gold: "bg-[#f3e4b8] text-[#7a5a0c]",
  green: "bg-[#dcecdc] text-[#2f5a36]",
  red: "bg-[#f3d8d4] text-[#7a2c26]",
};

export function Badge({ tone = "neutral", children }: Props) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
