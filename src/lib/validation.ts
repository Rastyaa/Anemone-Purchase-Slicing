export function clampQty(qty: number, stockHO: number): number {
  return Math.min(Math.max(qty, 0), stockHO);
}

export function isAtMinQty(qty: number): boolean {
  return qty <= 0;
}

export function isAtMaxStock(qty: number, stockHO: number): boolean {
  return qty >= stockHO;
}
