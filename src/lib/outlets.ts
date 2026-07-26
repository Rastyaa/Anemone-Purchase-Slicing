export interface Outlet {
  id: string;
  name: string;
}

export const outlets: Outlet[] = [
  { id: "denpasar-utara-2", name: "Denpasar Utara II" },
  { id: "denpasar-selatan-1", name: "Denpasar Selatan I" },
  { id: "kuta-utara", name: "Kuta Utara" },
];

export const DEFAULT_OUTLET_ID = outlets[0].id;
