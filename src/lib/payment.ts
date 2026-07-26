import type { PaymentMethod } from "@/lib/types";

export const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "transfer-bank", label: "Transfer Bank" },
  { value: "cod", label: "COD" },
  { value: "qris", label: "QRIS" },
];

export const paymentMethodLabel = Object.fromEntries(
  paymentOptions.map((option) => [option.value, option.label]),
) as Record<PaymentMethod, string>;
