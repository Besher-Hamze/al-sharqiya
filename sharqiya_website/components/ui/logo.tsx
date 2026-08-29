import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The wordmark is set in type rather than baked into the logo image so it
 * stays crisp, translates, and can flip to light-on-dark over the hero.
 */
export function Logo({
  name,
  tagline,
  light = false,
  className,
  markClassName,
}: {
  name: string;
  tagline?: string;
  light?: boolean;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={48}
        height={48}
        priority
        className={cn("h-11 w-auto", markClassName)}
      />
      <span className="hidden flex-col leading-tight sm:flex">
        <span
          className={cn(
            "font-display text-[15px] font-bold leading-tight transition-colors",
            light ? "text-white" : "text-graphite-900",
          )}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={cn(
              "tracking-brand text-[10px] font-medium uppercase tracking-[0.2em] transition-colors",
              light ? "text-gold-300" : "text-gold-600",
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
