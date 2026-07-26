"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";

interface FilterTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

export function FilterTabs<T extends string>({ options, value, onChange, ariaLabel }: FilterTabsProps<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectAt(index: number) {
    const total = options.length;
    const nextIndex = (index + total) % total;
    onChange(options[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        selectAt(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        selectAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        selectAt(0);
        break;
      case "End":
        event.preventDefault();
        selectAt(options.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${
              isSelected ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
