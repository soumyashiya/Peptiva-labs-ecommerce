"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal, matching the reference storefront's motion language.
 *
 * The reference does not use split-text or clip-path curtains — every entrance
 * is the same quiet gesture: a short rise with a fade, on a 0.66s
 * cubic-bezier(.16, 1, .3, 1) ease, with siblings staggered by ~90ms. That is
 * reproduced here with a plain IntersectionObserver driving the `.reveal` /
 * `.is-revealed` CSS pair, so there is no animation library on the critical
 * path and server-rendered markup stays visible if JS never runs.
 *
 * Usage: attach the returned ref to a section, then mark children with
 * `data-reveal`. Add `data-reveal-group` to a wrapper whose direct children
 * should stagger together.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!targets.length) return;

    // Prime the start state only now that we know JS is running — otherwise a
    // no-JS visitor would be left looking at permanently invisible content.
    // Anything already on screen when the page loads stays as rendered —
    // hiding it after paint just to fade it back in reads as a blank gap.
    // Only content below the fold gets the entrance animation.
    const pending = targets.filter(
      (el) => el.getBoundingClientRect().top >= window.innerHeight
    );
    if (!pending.length) return;
    pending.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries can arrive out of document order; sorting keeps the stagger
        // reading top-to-bottom rather than in observer-callback order.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        visible.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${i * 90}ms`;
          el.classList.add("is-revealed");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.01 }
    );

    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return scope;
}
