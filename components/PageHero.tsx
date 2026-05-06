import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import TopoPattern from "@/components/patterns/TopoPattern";

export default function PageHero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border-soft bg-bg-paper grain-overlay">
      <TopoPattern
        className="absolute inset-0 h-full w-full text-ink-secondary"
        opacity={0.13}
        density="medium"
      />
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14">
        <p className="field-label">N 47°&nbsp;·&nbsp;Packing one bag at a time</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tight text-ink-primary">
          {APP_NAME}
        </h1>
        <p className="mt-4 max-w-xl text-base sm:text-lg text-ink-secondary">
          {APP_TAGLINE}
        </p>
      </div>
    </section>
  );
}
