"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Smoothly counts up to the numeric portion of `value` (e.g. "€384,210", "+38%", "−62%")
 * preserving prefix/suffix exactly. Falls back to the raw string for users who prefer
 * reduced motion or for values without a numeric anchor.
 */
export function CountUp({ value, duration = 1.1, className }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  const parsed = React.useMemo(() => parseValue(value), [value]);

  React.useEffect(() => {
    if (!inView || !parsed || reduced || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, parsed.number, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = formatLike(v, parsed);
      },
    });
    return () => controls.stop();
  }, [inView, parsed, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {parsed && !reduced ? formatLike(0, parsed) : value}
    </span>
  );
}

interface Parsed {
  number: number;
  prefix: string;
  suffix: string;
  decimals: number;
  hasGrouping: boolean;
}

function parseValue(raw: string): Parsed | null {
  // Matches first numeric part, allowing comma/space grouping and decimals
  const match = raw.match(/^(.*?)(-?\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const cleaned = num.replace(/[,\s]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n)) return null;
  const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;
  const hasGrouping = /[,\s]/.test(num);
  return { number: n, prefix, suffix, decimals, hasGrouping };
}

function formatLike(value: number, p: Parsed): string {
  const n = p.decimals
    ? value.toFixed(p.decimals)
    : Math.round(value).toString();
  const formatted = p.hasGrouping
    ? Number(n).toLocaleString("en-US", {
        minimumFractionDigits: p.decimals,
        maximumFractionDigits: p.decimals,
      })
    : n;
  return `${p.prefix}${formatted}${p.suffix}`;
}
