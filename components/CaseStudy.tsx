"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { useReveal } from "./useReveal";
import CommunityStrip from "./CommunityStrip";

/**
 * Three stacked reference archetypes that always travel together:
 *
 *  1. an edge-bleeding media strip with the section title set hard left,
 *  2. a full-width washed slider whose copy sits left of the artwork,
 *  3. an oversized all-caps statement rendered in a horizontal gradient.
 */


const SLIDES = [
  {
    title: "The most analytically honest material we can supply",
    body: "Independently assayed, batch-coded, traceable.",
    img: "/new-images/Chic woman presenting GLOW GHK-CU.png",
  },
  {
    title: "Fixed-volume devices, filled under control",
    body: "No decanting, no repackaging, no guesswork.",
    img: "/new-images/Elegant woman presenting an ALLUVI GLOW carton.png",
  },
  {
    title: "Documented from synthesis to shipment",
    body: "Every kit arrives with its paperwork attached.",
    img: "/new-images/shipment.png",
  },
];

const AUTOPLAY_MS = 7000;

export default function CaseStudy() {
  const scope = useReveal<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, go]);

  const slide = SLIDES[index];

  return (
    <div ref={scope}>
      {/* ---- 1. community strip (shared component) ------------------- */}
      <CommunityStrip />

      {/* ---- 2. full-width slider ------------------------------------- */}
      <section className="bg-white pb-4">
        <div className="shell">
          <div
            data-reveal
            className="relative overflow-hidden rounded-lg bg-grad-wash"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Each slide is one wide banner (plain wash left, subject right)
                laid across the whole panel; the copy sits on the plain side. */}
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
              {SLIDES.map((s, i) => (
                <Image
                  key={s.img}
                  src={s.img}
                  alt={i === index ? s.title : ""}
                  fill
                  unoptimized
                  aria-hidden={i !== index}
                  className={`object-cover object-[80%_100%] transition-opacity lg:object-right duration-base ease-standard ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="relative grid items-center px-6 pb-7 pt-6 sm:p-12 lg:min-h-[460px] lg:grid-cols-2 lg:p-16 lg:pl-24">
              <div key={index} className="animate-fade-in min-h-[150px] lg:min-h-0">
                <h3 className="heading-editorial max-w-[15ch] text-[clamp(24px,6.5vw,40px)] leading-[1.3]">{slide.title}</h3>
                <p className="mt-3 lead lg:mt-5">{slide.body}</p>
              </div>
              {/* phones: arrows are hidden, so dashes switch slides */}
              <div className="mt-5 flex gap-2 lg:hidden">
                {SLIDES.map((sl, n) => (
                  <button
                    key={sl.img}
                    type="button"
                    aria-label={`Show slide ${n + 1}`}
                    aria-current={n === index ? "true" : undefined}
                    onClick={() => setIndex(n)}
                    className="py-2"
                  >
                    <span className="dash block w-8" data-active={n === index} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-3 right-3 hidden items-center justify-between lg:flex">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="btn-round pointer-events-auto"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="btn-round pointer-events-auto"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 3. gradient statement ------------------------------------ */}
      <section className="section bg-white">
        <div className="shell">
          <p
            data-reveal
            className="max-w-[16ch] bg-gradient-to-r from-berry-500 via-plum-500 to-teal-500 bg-clip-text text-band font-normal uppercase tracking-caps text-transparent"
          >
            Backed by real analysis, not marketing claims
          </p>
        </div>
      </section>
    </div>
  );
}
