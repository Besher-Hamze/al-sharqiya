import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function ProcessSteps({
  steps,
  stepLabel,
}: {
  steps: { title: string; body: string }[];
  /** Receives the 1-based step number, e.g. "Step {number}". */
  stepLabel: (n: number) => string;
}) {
  return (
    <Stagger className="relative grid gap-6 lg:grid-cols-4">
      {/* Connecting rule behind the cards on wide screens */}
      <span
        className="pointer-events-none absolute inset-x-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent lg:block"
        aria-hidden
      />

      {steps.map((step, i) => (
        <StaggerItem key={step.title} className="relative">
          <div className="brand-card h-full p-6 ring-1 ring-ink-200/70">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-900 font-display text-lg font-semibold text-gold-400">
              {i + 1}
            </span>
            <p className="tracking-brand mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
              {stepLabel(i + 1)}
            </p>
            <h3 className="mt-1.5 font-display text-lg font-semibold text-graphite-950">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {step.body}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
