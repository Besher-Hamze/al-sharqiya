import { BadgeCheck } from "lucide-react";

/**
 * A quiet, duplicated scroller of client names. No logos are used because we
 * do not have licensed marks for these organisations.
 */
export function ClientMarquee({
  heading,
  note,
  items,
}: {
  heading: string;
  note: string;
  items: string[];
}) {
  const track = [...items, ...items];

  return (
    <div className="text-center">
      <p className="tracking-brand text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">
        {heading}
      </p>

      <div className="edge-fade relative mt-7 overflow-hidden">
        <div className="flex w-max gap-4 motion-safe:animate-marquee motion-reduce:flex-wrap motion-reduce:justify-center">
          {track.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold whitespace-nowrap text-graphite-800 shadow-soft ring-1 ring-ink-200/70"
            >
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-gold-500"
                aria-hidden
              />
              {item}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-400">{note}</p>
    </div>
  );
}
