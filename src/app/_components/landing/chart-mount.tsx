"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders its children only after the component has mounted on the client.
 *
 * Recharts' `ResponsiveContainer` measures its parent's size on first render.
 * During SSR (and the very first client paint) there is no layout yet, so it
 * computes width/height of -1 and logs a warning. Gating the chart behind a
 * mount check lets the parent box exist first, so the container measures a real
 * size on its first render — no warning, no layout shift (the sized wrapper
 * div stays in place around this gate).
 */
export function ChartMount({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
