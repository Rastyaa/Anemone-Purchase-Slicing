export type StockStatus = "tersedia" | "terbatas" | "habis";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stockHO: number;
  description: string;
  gallery: string[];
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type PaymentMethod = "transfer-bank" | "cod" | "qris";

export type OrderStatus = "diproses" | "dikirim" | "selesai" | "dibatalkan";

export type OrderTimelineStep = "dibuat" | "diproses" | "dikirim" | "selesai";

export interface OrderLine {
  productId: string;
  name: string;
  qty: number;
  subtotal: number;
}

export interface Order {
  id: string;
  date: string;
  lines: OrderLine[];
  expedisi: string;
  ongkir: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  timeline: { step: OrderTimelineStep; timestamp?: string }[];
}
