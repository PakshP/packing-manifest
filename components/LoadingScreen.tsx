import { Compass } from "lucide-react";
import TopoPattern from "@/components/patterns/TopoPattern";

export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-base text-ink-primary">
      <TopoPattern
        className="absolute inset-0 h-full w-full text-ink-tertiary"
        opacity={0.1}
        density="medium"
      />
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-accent-moss shadow-sm">
          <Compass className="h-8 w-8 animate-spin-slow" strokeWidth={1.5} />
        </div>
        <p className="field-label text-ink-secondary">Establishing signal…</p>
      </div>
    </div>
  );
}
