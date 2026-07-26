export interface ExpedisiOption {
  value: string;
  label: string;
  ongkir: number;
}

export const expedisiOptions: ExpedisiOption[] = [
  { value: "cargo-jnr", label: "Cargo JNR", ongkir: 50000 },
  { value: "jne-trucking", label: "JNE Trucking", ongkir: 65000 },
  { value: "sicepat-cargo", label: "SiCepat Cargo", ongkir: 55000 },
];

export const DEFAULT_EXPEDISI_VALUE = expedisiOptions[0].value;

export function getExpedisiLabel(value: string): string {
  return expedisiOptions.find((option) => option.value === value)?.label ?? "";
}

export function getExpedisiOngkir(value: string): number {
  return expedisiOptions.find((option) => option.value === value)?.ongkir ?? 0;
}
