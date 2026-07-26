interface LoadingOverlayProps {
  open: boolean;
}

export function LoadingOverlay({ open }: LoadingOverlayProps) {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40"
    >
      <div className="flex w-72 flex-col items-center gap-3 rounded-lg bg-white p-8 text-center shadow-xl">
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"
        />
        <p className="font-semibold text-neutral-900">Memproses Pesanan...</p>
        <p className="text-sm text-neutral-500">Mohon tunggu, jangan tutup halaman ini.</p>
      </div>
    </div>
  );
}
