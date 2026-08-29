import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export function ValueGrid({
  values,
}: {
  values: { icon: string; title: string; body: string }[];
}) {
  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {values.map((value) => (
        <StaggerItem key={value.title}>
          <div className="group relative h-full overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition duration-500 hover:bg-white/[0.07] hover:ring-gold-400/40">
            <span
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300 ring-1 ring-gold-400/30 transition duration-500 group-hover:bg-gold-500 group-hover:text-graphite-950">
              <DynamicIcon name={value.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-white">
              {value.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-graphite-300/85">
              {value.body}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
