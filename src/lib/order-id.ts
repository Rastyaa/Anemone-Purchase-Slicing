export function generateOrderId(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const sequence = String(Math.floor(Math.random() * 900) + 100);
  return `PR-${yyyy}${mm}${dd}-${sequence}`;
}
