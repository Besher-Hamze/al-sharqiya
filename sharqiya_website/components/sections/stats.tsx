import { CountUp } from "@/components/motion/count-up";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Stats({
  items,
  light = false,
  className,
}: {
  items: { value: string; label: string }[];
  light?: boolean;
  className?: string;
}) {
  return (
    <Stagger
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <StaggerItem key={item.label}>
          <div
            className={cn(
              "relative h-full overflow-hidden rounded-2xl px-6 py-7 text-center",
              light
                ? "bg-white/5 ring-1 ring-white/10"
                : "bg-white shadow-soft ring-1 ring-ink-200/70",
            )}
          >
            <span
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              aria-hidden
            />
            <CountUp
              value={item.value}
              className={cn(
                "font-display text-3xl font-semibold sm:text-4xl",
                light ? "text-gradient-gold" : "text-gold-600",
              )}
            />
            <p
              className={cn(
                "mt-2.5 text-sm leading-snug",
                light ? "text-graphite-300" : "text-ink-500",
              )}
            >
              {item.label}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
