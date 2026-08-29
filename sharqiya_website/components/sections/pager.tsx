import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Previous/next navigation between sibling detail pages. Arrows point at the
 * reading direction, so they flip under RTL.
 */
export function Pager({
  prev,
  next,
  prevLabel,
  nextLabel,
}: {
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
  prevLabel: string;
  nextLabel: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="grid gap-4 border-t border-ink-200 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-200/70 transition hover:ring-gold-400"
        >
          <ArrowLeft
            className="h-5 w-5 shrink-0 text-gold-600 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
            aria-hidden
          />
          <span className="min-w-0">
            <span className="tracking-brand block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
              {prevLabel}
            </span>
            <span className="mt-0.5 block truncate font-display text-sm font-semibold text-graphite-950">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center justify-end gap-3 rounded-2xl bg-white p-5 text-end shadow-soft ring-1 ring-ink-200/70 transition hover:ring-gold-400"
        >
          <span className="min-w-0">
            <span className="tracking-brand block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
              {nextLabel}
            </span>
            <span className="mt-0.5 block truncate font-display text-sm font-semibold text-graphite-950">
              {next.title}
            </span>
          </span>
          <ArrowRight
            className="h-5 w-5 shrink-0 text-gold-600 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            aria-hidden
          />
        </Link>
      ) : null}
    </nav>
  );
}
