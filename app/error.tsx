"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CloudRain, RotateCcw, ArrowLeft } from "lucide-react";

import TopoPattern from "@/components/patterns/TopoPattern";
import TrailDivider from "@/components/patterns/TrailDivider";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="topo-bg flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border-soft bg-bg-paper grain-overlay">
        <TopoPattern
          className="absolute inset-0 h-full w-full text-ink-secondary"
          opacity={0.13}
          density="medium"
        />
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16">
          <p className="field-label">
            condition&nbsp;·&nbsp;rough weather ahead
          </p>

          <div className="mt-5 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-accent-rust/10 text-accent-rust"
            >
              <CloudRain className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-ink-primary">
              Something went sideways.
            </span>
          </div>

          <p className="mt-5 max-w-lg text-base sm:text-lg text-ink-secondary">
            We hit unexpected terrain on the way to that page. Try the route
            again, or head back to base camp and pick a different line.
          </p>

          {error?.digest ? (
            <p className="mt-4 inline-block rounded-md border border-border-soft bg-bg-base px-3 py-1.5 font-mono text-xs text-ink-tertiary">
              ref&nbsp;·&nbsp;{error.digest}
            </p>
          ) : null}

          <TrailDivider className="my-8" icon="peak" />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-accent-moss px-4 py-2.5 text-sm font-medium text-bg-paper shadow-sm transition hover:bg-accent-moss/90"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-bg-paper px-4 py-2.5 text-sm font-medium text-ink-primary shadow-sm transition hover:bg-bg-elevated"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              Return to base camp
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
