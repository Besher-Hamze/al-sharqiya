import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-300 focus:border-gold-400 focus:ring-4 focus:ring-gold-100 disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-sm font-medium text-graphite-800"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-ink-400">({optional})</span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-ink-400">{hint}</p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-error"
        >
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
