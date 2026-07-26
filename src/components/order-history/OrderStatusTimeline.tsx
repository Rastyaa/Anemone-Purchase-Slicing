import { LoopGauge } from "@/components/ui/LoopGauge";
import type { OrderTimelineStep } from "@/lib/types";

const stepLabel: Record<OrderTimelineStep, string> = {
  dibuat: "Dibuat",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
};

interface OrderStatusTimelineProps {
  timeline: { step: OrderTimelineStep; timestamp?: string }[];
  cancelled?: boolean;
}

export function OrderStatusTimeline({ timeline, cancelled }: OrderStatusTimelineProps) {
  return (
    <ol className="flex flex-col gap-3">
      {timeline.map((entry) => {
        const done = Boolean(entry.timestamp);
        return (
          <li key={entry.step} className="flex items-start gap-3">
            <span aria-hidden="true" className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              <LoopGauge
                fraction={done ? 1 : 0}
                size={20}
                strokeWidth={2.5}
                className={done ? "text-success-600" : "text-neutral-200"}
              />
              {done && <span className="absolute text-[10px] text-success-700">✓</span>}
            </span>
            <div>
              <p className={`text-sm font-medium ${done ? "text-neutral-900" : "text-neutral-500"}`}>
                {stepLabel[entry.step]}
              </p>
              {entry.timestamp && (
                <p className="text-xs text-neutral-500">
                  {new Date(entry.timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              )}
            </div>
          </li>
        );
      })}
      {cancelled && <li className="text-sm font-medium text-danger-600">Pesanan dibatalkan</li>}
    </ol>
  );
}
