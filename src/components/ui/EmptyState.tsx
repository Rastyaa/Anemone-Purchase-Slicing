import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <div className="text-neutral-300" aria-hidden="true">
        {icon}
      </div>
      <p className="font-medium text-neutral-700">{title}</p>
      {description && <p className="text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
