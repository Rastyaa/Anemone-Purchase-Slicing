import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">{children}</div>;
}
