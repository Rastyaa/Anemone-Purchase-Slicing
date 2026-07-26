import type { ReactNode } from "react";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "brand" | "neutral";

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-info-50 text-info-700",
  brand: "bg-brand-50 text-brand-700",
  neutral: "bg-neutral-100 text-neutral-500",
};

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
