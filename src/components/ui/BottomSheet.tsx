"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

const DISMISS_THRESHOLD = 120;

export function BottomSheet({ open, onClose, children, labelledBy }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const dialogRef = useFocusTrap<HTMLDivElement>(open);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    setDragY(0);
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    startYRef.current = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const delta = event.clientY - startYRef.current;
    setDragY(Math.max(delta, 0));
  }

  function handlePointerUp() {
    setDragging(false);
    if (dragY > DISMISS_THRESHOLD) {
      onClose();
    }
    setDragY(0);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-neutral-900/40 motion-safe:animate-fade-in">
      <button type="button" aria-label="Tutup" onClick={onClose} tabIndex={-1} className="absolute inset-0 cursor-default" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragging || prefersReducedMotion ? "none" : "transform 0.2s ease-out",
        }}
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-white p-4 shadow-xl outline-none motion-safe:animate-sheet-in"
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="-mx-4 -mt-4 mb-3 cursor-grab touch-none px-4 pb-2 pt-4 active:cursor-grabbing"
        >
          <div className="mx-auto h-1 w-10 rounded-full bg-neutral-300" aria-hidden="true" />
        </div>
        {children}
      </div>
    </div>
  );
}
