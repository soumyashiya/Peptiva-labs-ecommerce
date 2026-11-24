"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

/**
 * Horizontal snap carousel.
 *
 * Reference behaviour: native horizontal scrolling with snap points, circular
 * arrow buttons vertically centred and half-overlapping the first/last card,
 * and a hairline progress track beneath whose dark segment reflects both the
 * visible fraction and the scroll offset. Arrows disable at the ends.
 *
 * Driving this off real scroll (rather than a transform-based slider) means
 * touch, trackpad and keyboard all work for free.
 *
 * `autoplay` opts a rail into advancing itself one card at a time, wrapping
 * back to the first card at the end.
 */
export default function Rail({
  children,
  className = "",
  itemClassName = "",
  gap = "gap-4 sm:gap-5",
  arrowOffset = "-left-5 -right-5",
  arrowInset = "inset-y-0",
  arrowClassName = "btn-round",
  progressClassName = "mt-8",
  showProgress = true,
  ariaLabel,
  autoplay = false,
  autoplayDelay = 4500,
}: {
  children: React.ReactNode;
  className?: string;
  /** Applied to the rail's own padding so cards can bleed to the shell edge. */
  itemClassName?: string;
  gap?: string;
  arrowOffset?: string;
  /** Vertical extent of the arrow band, relative to the scroller. */
  arrowInset?: string;
  arrowClassName?: string;
  progressClassName?: string;
  showProgress?: boolean;
  ariaLabel?: string;
  /** Advance on a timer. Yields to the reader — see the autoplay effect. */
  autoplay?: boolean;
  autoplayDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, frac: 1, pos: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const frac = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    setState({
      atStart: el.scrollLeft <= 1,
      atEnd: max <= 1 || el.scrollLeft >= max - 1,
      frac: Math.min(1, frac),
      pos: max > 0 ? el.scrollLeft / max : 0,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  /**
   * Autoplay.
   *
   * Advances a card at a time and wraps at the end. It always yields to the
   * reader: pointer over the rail, focus inside it, a recent swipe / wheel /
   * key, a rail scrolled off-screen or a backgrounded tab all hold it, and
   * reduced-motion opts out of it entirely. Snap points absorb any drift, so
   * stepping by a measured card width stays aligned.
   */
  useEffect(() => {
    if (!autoplay) return;
    const el = ref.current;
    const frame = frameRef.current;
    if (!el || !frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hovered = false;
    let touchedAt = 0;

    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    const touched = () => (touchedAt = Date.now());

    frame.addEventListener("pointerenter", enter);
    frame.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", touched, { passive: true });
    el.addEventListener("touchstart", touched, { passive: true });
    el.addEventListener("wheel", touched, { passive: true });
    el.addEventListener("keydown", touched);

    /** At least 40% of the rail (or of the viewport it fills) is on screen. */
    const onScreen = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return shown >= Math.min(r.height, vh) * 0.4;
    };

    const tick = () => {
      if (hovered || document.hidden || !onScreen()) return;
      if (frame.contains(document.activeElement)) return;
      // Hand the rail back for a couple of beats after a manual nudge.
      if (Date.now() - touchedAt < autoplayDelay * 2) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return; // everything already fits
      if (el.scrollLeft >= max - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const first = el.firstElementChild as HTMLElement | null;
      const gapPx = parseFloat(getComputedStyle(el).columnGap) || 0;
      const step = first ? first.offsetWidth + gapPx : el.clientWidth * 0.8;
      el.scrollBy({ left: step, behavior: "smooth" });
    };

    const id = window.setInterval(tick, autoplayDelay);
    return () => {
      window.clearInterval(id);
      frame.removeEventListener("pointerenter", enter);
      frame.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", touched);
      el.removeEventListener("touchstart", touched);
      el.removeEventListener("wheel", touched);
      el.removeEventListener("keydown", touched);
    };
  }, [autoplay, autoplayDelay]);

  // Page by one viewport-width of cards, which lands on a snap point.
  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step / 1.4)), behavior: "smooth" });
  };

  // The thumb never shrinks below a visible minimum, and travels across the
  // remaining track proportionally to scroll position.
  const thumb = Math.max(state.frac, 0.08);
  const travel = (1 - thumb) * state.pos * 100;

  return (
    <div className={className}>
      <div ref={frameRef} className="relative">
      <div
        ref={ref}
        className={`rail ${gap} ${itemClassName}`}
        role="group"
        aria-label={ariaLabel}
      >
        {children}
      </div>

      {/* Arrows sit outside the rail on wide screens, hidden on touch widths
          where the rail is swiped directly. */}
      <div
        className={`pointer-events-none absolute ${arrowInset} ${arrowOffset} hidden items-center justify-between lg:flex`}
      >
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={state.atStart}
          aria-label="Previous"
          className={`${arrowClassName} pointer-events-auto`}
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={state.atEnd}
          aria-label="Next"
          className={`${arrowClassName} pointer-events-auto`}
        >
          <ChevronRightIcon />
        </button>
      </div>
      </div>

      {showProgress && (
        <div className={`rail-progress ${progressClassName}`} aria-hidden>
          <span
            style={{
              width: `${thumb * 100}%`,
              transform: `translateX(${travel / thumb}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
