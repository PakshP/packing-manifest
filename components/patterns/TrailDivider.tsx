import { Compass } from "lucide-react";

type TrailDividerProps = {
  className?: string;
  icon?: "compass" | "peak";
};

export default function TrailDivider({
  className = "",
  icon = "compass",
}: TrailDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`trail-divider ${className}`}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-ink-tertiary">
        {icon === "compass" ? (
          <Compass className="h-3.5 w-3.5" strokeWidth={1.6} />
        ) : (
          <PeakMark />
        )}
      </span>
    </div>
  );
}

function PeakMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 13 L6 6 L9 10 L11 7 L14 13 Z" />
    </svg>
  );
}
