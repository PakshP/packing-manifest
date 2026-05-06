"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AccentKey } from "@/types";
import { ICON_MAP } from "@/lib/data";
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/styles";

export type TabItem = {
  id: string;
  name: string;
  iconKey: string;
  count: number;
  accent: AccentKey;
};

type Props = {
  tabs: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

const DRAG_THRESHOLD_PX = 5;

export default function TabStrip({ tabs, activeId, onSelect }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const [dragging, setDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [tabs.length]);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setDragging(true);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    if (!state.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD_PX) state.moved = true;
    el.scrollLeft = state.startScrollLeft - dx;
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    if (!state.active) return;
    const el = scrollerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    state.active = false;
    setDragging(false);
    if (state.moved) {
      setTimeout(() => {
        state.moved = false;
      }, 0);
    }
  }

  function handleClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if (dragState.current.moved) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function scrollByDirection(direction: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(160, el.clientWidth * 0.7);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div
      role="tablist"
      aria-label="Sections"
      className="relative -mx-4 sm:-mx-6 lg:-mx-8"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-bg-base to-transparent sm:w-8"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg-base to-transparent sm:w-10"
        aria-hidden="true"
      />

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByDirection("left")}
          aria-label="Scroll tabs left"
          className="absolute left-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-ink-secondary shadow-sm transition-colors hover:bg-bg-elevated hover:text-ink-primary sm:flex"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByDirection("right")}
          aria-label="Scroll tabs right"
          className="absolute right-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-ink-secondary shadow-sm transition-colors hover:bg-bg-elevated hover:text-ink-primary sm:flex"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      )}

      <div
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        className={`flex gap-2 overflow-x-auto scrollbar-none pb-1 pl-4 pr-10 sm:pl-6 sm:pr-12 lg:pl-8 ${
          dragging
            ? "cursor-grabbing select-none"
            : "cursor-grab scroll-smooth snap-x snap-proximity"
        }`}
      >
        {tabs.map((tab) => {
          const Icon = ICON_MAP[tab.iconKey];
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onSelect(tab.id)}
              className={`group inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                active
                  ? `${ACCENT_BG[tab.accent]} text-white border-transparent shadow-sm`
                  : "bg-bg-paper border-border-soft text-ink-secondary hover:border-border-strong hover:text-ink-primary"
              }`}
            >
              {Icon && (
                <Icon
                  className={`h-4 w-4 ${active ? "text-white" : ACCENT_TEXT[tab.accent]}`}
                  strokeWidth={1.8}
                />
              )}
              <span className="font-medium whitespace-nowrap">{tab.name}</span>
              <span
                className={`font-mono text-[0.65rem] tabular-nums uppercase tracking-widest rounded-full px-1.5 py-0.5 ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-bg-base text-ink-tertiary"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
