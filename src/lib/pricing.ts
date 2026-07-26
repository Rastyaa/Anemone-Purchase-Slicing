import type { CartLine, Product } from "@/lib/types";

export const TAX_RATE = 0.11;
export const ONGKIR = 50000;
export const EXPEDISI = "Cargo JNR";

export function calcSubtotal(lines: CartLine[], products: Product[]): number {
  return lines.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);
}

export function calcTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE);
}

export function calcTotal(subtotal: number, tax: number, ongkir: number): number {
  return subtotal + tax + ongkir;
}
