"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animates the leading number inside a label while keeping any prefix or
 * suffix intact, so "10,000 m²" and "2,500+" both count up correctly.
 */
export function CountUp({
  value,
  duration = 1.6,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const animatable = Boolean(match) && Number.isFinite(target) && !reduce;

  const [current, setCurrent] = useState(animatable ? 0 : target);

  useEffect(() => {
    if (!animatable || !inView) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // Ease-out cubic: fast start, gentle landing on the final figure.
      setCurrent(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animatable, inView, target, duration]);

  if (!animatable) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {match![1]}
      {current.toLocaleString("en-US")}
      {match![3]}
    </span>
  );
}
