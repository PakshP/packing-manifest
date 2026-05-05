import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

import TopoPattern from "@/components/patterns/TopoPattern";
import TrailDivider from "@/components/patterns/TrailDivider";

export default function NotFound() {
  return (
    <main className="topo-bg flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border-soft bg-bg-paper grain-overlay">
        <TopoPattern
          className="absolute inset-0 h-full w-full text-ink-secondary"
          opacity={0.13}
          density="medium"
        />
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16">
          <p className="field-label">N 47°&nbsp;·&nbsp;off the marked trail</p>

          <div className="mt-5 flex items-baseline gap-4">
            <span
              aria-hidden="true"
              className="font-display text-7xl sm:text-8xl font-black leading-none tracking-tight text-accent-rust"
            >
              404
            </span>
            <Compass
              className="h-7 w-7 text-ink-tertiary animate-spin-slow"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-black leading-[1.05] tracking-tight text-ink-primary">
            This page isn&rsquo;t on the map.
          </h1>

          <p className="mt-4 max-w-lg text-base sm:text-lg text-ink-secondary">
            The route you followed runs out here. Backtrack to base camp and
            we&rsquo;ll get you packing again.
          </p>

          <TrailDivider className="my-8" />

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-accent-moss px-4 py-2.5 text-sm font-medium text-bg-paper shadow-sm transition hover:bg-accent-moss/90"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              Return to base camp
            </Link>
            <span className="field-label">manifest.home</span>
          </div>
        </div>
      </section>
    </main>
  );
}
