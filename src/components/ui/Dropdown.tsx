"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

const DEFAULT_TRIGGER_CLASSNAME =
  "flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium text-neutral-700 hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1";

const PANEL_MARGIN = 8;
const PANEL_MIN_WIDTH = 220;

interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  trigger?: (selected: DropdownOption<T> | undefined) => ReactNode;
  className?: string;
  triggerClassName?: string;
}

export function Dropdown<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  trigger,
  className = "",
  triggerClassName = DEFAULT_TRIGGER_CLASSNAME,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [panelRect, setPanelRect] = useState<{ top: number; left: number; minWidth: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = options.find((option) => option.value === value);
  const selectedIndex = options.findIndex((option) => option.value === value);

  useEffect(() => {
    if (!open) {
      setPanelRect(null);
      return;
    }
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.max(rect.width, PANEL_MIN_WIDTH);
    const left = Math.min(rect.left, window.innerWidth - width - PANEL_MARGIN);
    setPanelRect({ top: rect.bottom + PANEL_MARGIN, left: Math.max(left, PANEL_MARGIN), minWidth: width });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab") setOpen(false);
    }
    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;
    optionRefs.current[focusIndex]?.focus();
  }, [open, selectedIndex]);

  function focusOption(index: number) {
    const total = options.length;
    const nextIndex = (index + total) % total;
    optionRefs.current[nextIndex]?.focus();
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(options.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={triggerClassName}
      >
        {trigger ? trigger(selected) : selected?.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open &&
        panelRect &&
        createPortal(
          <ul
            ref={panelRef}
            role="listbox"
            aria-label={ariaLabel}
            style={{ top: panelRect.top, left: panelRect.left, minWidth: panelRect.minWidth }}
            className="fixed z-50 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    onKeyDown={(event) => handleOptionKeyDown(event, index)}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50 focus-visible:bg-brand-50 focus-visible:outline-none ${
                      isSelected ? "text-brand-700" : "text-neutral-700"
                    }`}
                  >
                    <span>
                      <span className="block font-medium">{option.label}</span>
                      {option.description && <span className="block text-xs text-neutral-500">{option.description}</span>}
                    </span>
                    {isSelected && (
                      <span aria-hidden="true" className="text-brand-600">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
