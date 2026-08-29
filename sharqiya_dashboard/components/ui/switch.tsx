"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md";
}

/** RTL-safe toggle — thumb uses logical `start-*` positioning instead of translate-x. */
export function Switch({
  checked,
  onChange,
  disabled,
  label,
  size = "md",
}: SwitchProps) {
  const thumbSize = size === "md" ? "size-4.5" : "size-3.5";
  const thumbChecked =
    size === "md"
      ? "start-[calc(100%-1.125rem-0.125rem)]"
      : "start-[calc(100%-0.875rem-0.125rem)]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "md" ? "h-5.5 w-10" : "h-4.5 w-8",
        checked ? "brand-gradient" : "bg-zinc-200",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-200 ease-out",
          thumbSize,
          checked ? thumbChecked : "start-0.5",
        )}
      />
    </button>
  );
}
