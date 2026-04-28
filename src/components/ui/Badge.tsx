import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeTone = "accent" | "gold" | "muted" | "red" | "green";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  title?: string;
}

export function Badge({ children, tone = "muted", title }: BadgeProps) {
  const tones: Record<BadgeTone, string> = {
    accent: "bg-[#e8d6ef] text-[#4c235c]",
    gold: "bg-[#f6df9a] text-[#553716]",
    green: "bg-[#dbe8c8] text-[#314d28]",
    muted: "bg-[#fff8e8]/75 text-[#4a3522]",
    red: "bg-[#ead0c5] text-[#7e1f22]",
  };

  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full border border-[#4d2e1a]/20 px-2.5 py-0.5 text-xs font-extrabold",
        tones[tone]
      )}
      title={title}
    >
      {children}
    </span>
  );
}
