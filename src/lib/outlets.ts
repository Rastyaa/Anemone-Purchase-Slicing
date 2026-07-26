export interface Outlet {
  id: string;
  name: string;
  region: string;
}

export const outlets: Outlet[] = [
  { id: "denpasar-utara-2", name: "Denpasar Utara II", region: "Bali — kode DPS-02" },
  { id: "denpasar-selatan-1", name: "Denpasar Selatan I", region: "Bali — kode DPS-01" },
  { id: "kuta-utara", name: "Kuta Utara", region: "Bali — kode KTU-01" },
];

export const DEFAULT_OUTLET_ID = outlets[0].id;
