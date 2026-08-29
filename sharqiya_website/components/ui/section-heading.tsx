import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
  /** Use on dark section backgrounds */
  light?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className,
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "mb-5 flex items-center gap-3",
            align === "center" ? "justify-center" : "justify-start",
          )}
        >
          <span
            className={cn(
              "h-px w-8 bg-gradient-to-r from-transparent to-gold-400",
              align === "center" ? "hidden sm:block" : "",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "tracking-brand inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em]",
              light
                ? "bg-white/10 text-gold-300 ring-1 ring-white/20"
                : "bg-gold-50 text-gold-700 ring-1 ring-gold-200",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                light ? "bg-gold-300" : "bg-gold-500",
              )}
              aria-hidden
            />
            {eyebrow}
          </span>
          <span
            className={cn(
              "h-px w-8 bg-gradient-to-l from-transparent to-gold-400",
              align === "center" ? "hidden sm:block" : "",
            )}
            aria-hidden
          />
        </div>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[2.6rem]",
          light ? "text-white" : "text-graphite-950",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            light ? "text-graphite-200/85" : "text-ink-500",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
