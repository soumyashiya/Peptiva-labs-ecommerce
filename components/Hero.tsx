"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShieldIcon } from "./icons";
import { archivo, blackletter, bodoni, cormorant, playfair } from "@/lib/heroFonts";

/**
 * Hero.
 *
 * Geometry measured off the reference at a 1902px viewport:
 *   - rounded (40px) container inset 52px from the viewport, 24px below the
 *     announcement bar; the navbar pill floats 24px inside its top edge
 *   - 525px slide area + 60px proof strip welded to the bottom edge
 *   - copy column starts ~215px inside the container: two small chips,
 *     50px headline with an italic second line, 190×52 black button,
 *     dash pagination
 *   - artwork centred at ~55% of the width, ratings pill floating right
 */

type Slide = {
  title: string;
  accent: string;
  href: string;
  cta: string;
  img: string;
  /** Wash for this slide. Painted at 600% size and panned while active. */
  gradient: string;
  /** Banner's own edge colours (sampled from the file), painted behind the
   *  contained image so any letterbox space blends into the photo. */
  fill: string;
  /** Show the banner at full size instead of the default 88% zoom-out. */
  fullSize?: boolean;
  /** Subject position in the banner, used to crop it on phones. */
  focus: string;
};

const SLIDES: Slide[] = [
  {
    title: "Where research",
    accent: "meets purity",
    href: "/products",
    cta: "Shop all",
    img: "/new-images/hero1.webp",
    focus: "56% 100%",
    fill: "linear-gradient(90deg, #FDDCF0, #FDDCF0)",
    gradient: "linear-gradient(272deg, #E8E8E8 1.57%, #FFD5EF 50.28%, #FFE6EE 98.32%)",
  },
  {
    title: "Every batch,",
    accent: "independently assayed",
    href: "/#why",
    cta: "See the reports",
    img: "/new-images/hero2.webp",
    focus: "56% 100%",
    fill: "linear-gradient(90deg, #E7E6E8, #E7E6E8)",
    gradient: "linear-gradient(72deg, #F5F5F5 0%, #F5F5F5 12.39%, #E4E4E4 51.59%, #EFEFEF 87.61%)",
  },
  {
    title: "Purity you can",
    accent: "actually verify",
    href: "/products",
    cta: "Shop all",
    img: "/new-images/hero3.webp",
    focus: "80% 60%",
    fill: "linear-gradient(90deg, #FDE9F2, #FCDDE9)",
    gradient: "linear-gradient(281deg, #FFD3DF 8.12%, #FFF1F5 92.02%)",
  },
  {
    title: "Research materials,",
    accent: "done properly",
    href: "/#about",
    cta: "About us",
    img: "/new-images/hero4.webp",
    focus: "64% 50%",
    fullSize: true,
    fill: "linear-gradient(90deg, #FCE2F0, #FADCF3)",
    gradient: "linear-gradient(93deg, #FFEAED 2.19%, #F6CDFA 71.83%, #FAFCFC 97.82%)",
  },
  {
    title: "Sealed at the source,",
    accent: "cold to your bench",
    href: "/science",
    cta: "See the science",
    img: "/new-images/hero5.webp",
    focus: "76% 100%",
    fill: "linear-gradient(90deg, #EEDDEA, #F0D8E8)",
    gradient: "linear-gradient(92deg, #E8E8E8 1.57%, #FFD5EF 50.28%, #FFE6EE 98.32%)",
  },
];

const PROOF: { key: string; node: React.ReactNode }[] = [
  {
    key: "janoshik",
    node: <span className={`${blackletter.className} text-[21px]`}>Janoshik Analytical</span>,
  },
  {
    key: "hplc",
    node: <span className={`${playfair.className} text-[22px] font-black tracking-tight`}>HPLC Verified</span>,
  },
  {
    key: "lcms",
    node: (
      <span className={`${bodoni.className} inline-block origin-left scale-x-[0.8] text-[22px] uppercase tracking-[0.18em]`}>
        LC·MS
      </span>
    ),
  },
  {
    key: "cold",
    node: <span className={`${archivo.className} text-[19px] tracking-tight`}>ColdChain</span>,
  },
  {
    key: "purity",
    node: (
      <span className={`${bodoni.className} inline-block scale-x-[0.75] text-[22px] uppercase tracking-[0.2em]`}>
        Purity
      </span>
    ),
  },
  {
    key: "batch",
    node: (
      <span className="text-[21px] tracking-tight">
        <span className={`${playfair.className} font-black`}>Batch</span>
        <span className="font-light">Traced</span>
      </span>
    ),
  },
  {
    key: "tamper",
    node: (
      <span className={`${bodoni.className} inline-flex items-center gap-2 text-[19px] uppercase`}>
        <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black text-white">
          <ShieldIcon width={13} height={13} />
        </span>
        Tamper-Evident
      </span>
    ),
  },
  {
    key: "iso",
    node: <span className="text-[20px] font-bold lowercase tracking-[-0.06em]">iso grade</span>,
  },
  {
    key: "sealed",
    node: <span className={`${cormorant.className} text-[23px] uppercase italic tracking-[0.08em]`}>Sealed</span>,
  },
  {
    key: "standard",
    node: (
      <span className={`${playfair.className} text-[19px] font-bold tracking-[-0.04em]`}>ResearchStandard.</span>
    ),
  },
];

const AUTOPLAY_MS = 4000;

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-[3px] text-black">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} size={size} fill={value - i} />
      ))}
    </span>
  );
}

/** Green tile row — five squares, each carrying a white star; the last
 *  tile is only partly green when the score isn't whole (e.g. 4.8). */
function TileStars({ value }: { value: number }) {
  return (
    <span className="flex gap-[3px]" role="img" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const pct = Math.max(0, Math.min(1, value - i)) * 100;
        return (
          <span
            key={i}
            className="relative flex h-[22px] w-[22px] items-center justify-center text-white"
            style={{ background: `linear-gradient(90deg, #00B67A ${pct}%, #DCDCE6 ${pct}%)` }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
              <path fill="currentColor" d="M12 2.4l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.25 6.2 20.3l1.1-6.47L2.6 9.25l6.5-.95L12 2.4z" />
            </svg>
          </span>
        );
      })}
    </span>
  );
}

/**
 * Ratings pill, laid out like the reference's two-column review badge:
 * a small brand-style label over a row of stars and one line of detail.
 * Left column uses green star tiles, right column large black stars.
 */
function RatingCard() {
  return (
    <div className="flex max-w-full flex-wrap items-center justify-center gap-x-9 gap-y-4 rounded-[46px] bg-white/70 px-7 py-4 shadow-[0_2px_24px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-8">
      <div>
        <p className="flex items-center gap-1 text-[14px] font-medium leading-none text-black">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden className="text-[#00B67A]">
            <path fill="currentColor" d="M12 2.4l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.25 6.2 20.3l1.1-6.47L2.6 9.25l6.5-.95L12 2.4z" />
          </svg>
          Verified buyers
        </p>
        <div className="mt-2">
          <TileStars value={4.8} />
        </div>
        <p className="mt-2 whitespace-nowrap text-[11px] text-black">
          Score <span className="font-medium">4.8</span>{" "}
          <span className="underline underline-offset-2">1,600+ orders</span>
        </p>
      </div>
      <div>
        <p className="flex items-center gap-1 text-[17px] font-medium uppercase leading-none tracking-[-0.01em] text-black">
          <span className="inline-flex h-[17px] w-[17px] items-center justify-center rounded-full bg-black text-white">
            <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden>
              <path fill="currentColor" d="M12 2.4l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.25 6.2 20.3l1.1-6.47L2.6 9.25l6.5-.95L12 2.4z" />
            </svg>
          </span>
          Lab results
        </p>
        <div className="mt-2">
          <Stars value={5} size={27} />
        </div>
        <p className="mt-2 whitespace-nowrap text-[11px] text-black">
          Rated 5.0 | <span className="font-medium">100% of batches tested</span>
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex(i % SLIDES.length), []);

  // Which banners have finished downloading. Autoplay only advances onto a
  // slide whose image is ready, so a slow connection never fades into an
  // empty frame.
  const [ready, setReady] = useState<boolean[]>(() => SLIDES.map(() => false));
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const markReady = useCallback(
    (i: number) =>
      setReady((r) => (r[i] ? r : r.map((v, n) => (n === i ? true : v)))),
    []
  );

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(
      () =>
        setIndex((i) => {
          const next = (i + 1) % SLIDES.length;
          return readyRef.current[next] ? next : i;
        }),
      AUTOPLAY_MS
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const slide = SLIDES[index];

  return (
    <section id="home" className="px-3 pt-3 lg:px-[52px] lg:pt-6">
      <div
        className="relative overflow-hidden rounded-[28px] bg-[#F1DCE7] lg:rounded-[40px]"
      >
        {/* ---- colour washes -------------------------------------------
            Reference behaviour: every slide owns a gradient painted at
            600% × 600%. Only the active slide's wash animates — its
            background-position pans 0% → 100% over 8s (ease, looping) so
            the colours drift slowly across the hero — and slides
            cross-fade over 1s on cubic-bezier(0.25, 1, 0.5, 1). */}
        {SLIDES.map((s, i) => (
          <div
            key={`wash-${s.title}`}
            aria-hidden
            className={`hero-wash absolute inset-0 ${i === index ? "hero-wash--active opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: s.fill }}
          />
        ))}

        {/* ---- slide area ------------------------------------------------ */}
        {/* 525px of slide + the 60px strip, which overlays the artwork so the
            image shows through its frosted band. */}
        <div className="relative flex flex-col pb-[60px] lg:block lg:h-[585px] lg:pb-0">
          {/* artwork — the full banner is always shown (object-contain, never
              cropped): on desktop it fills the hero, anchored to the bottom,
              with the banner's own edge colours filling any spare space; on
              mobile it sits under the copy at its native 3:1 ratio.
              Served unoptimised so the original PNG reaches the browser at
              full quality, with no recompression. */}
          <div className="relative order-1 mt-[78px] aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto">
            {SLIDES.map((s, i) => (
              <div
                key={s.title}
                aria-hidden={i !== index}
                className={`hero-fade absolute inset-0 ${i === index ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundImage: s.fill }}
              >
                <Image
                  src={s.img}
                  alt=""
                  fill
                  unoptimized
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  onLoad={() => markReady(i)}
                  style={{ ["--focus" as string]: s.focus }}
                  className={`origin-bottom scale-[1.03] object-cover [object-position:var(--focus)] lg:object-contain lg:[object-position:center_bottom] ${s.fullSize ? "lg:scale-100" : "lg:scale-[0.88]"}`}
                />
              </div>
            ))}
          </div>

          {/* copy */}
          <div
            className="relative z-10 order-2 px-5 pb-4 pt-6 sm:px-8 lg:pl-[12%] lg:pt-[104px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-[23px] items-center gap-1.5 rounded-pill bg-white px-2 text-[13px] text-grey-700">
                <span className="rounded-[4px] bg-[#3BFFC1] px-1 text-[11px] font-bold leading-[16px] text-black">
                  HPLC
                </span>
                Third-party tested
              </span>
              <span className="inline-flex h-[23px] items-center gap-1 rounded-pill bg-white px-2.5 text-[13px] text-grey-700">
                Free shipping via
                <span className="font-bold text-berry-500">cold-chain</span>
              </span>
            </div>

            <div key={index} className="animate-fade-up">
              {/* Capped so the longest accent line ("independently assayed")
                  still wraps clear of the artwork at `left-[40%]`. */}
              <h1 className="mt-6 text-[clamp(30px,8vw,40px)] font-normal leading-[1.25] text-black lg:mt-[44px] lg:max-w-[26vw] lg:text-[50px]">
                {slide.title}
                <br />
                <em className="font-normal italic">{slide.accent}</em>
              </h1>
              <Link
                href={slide.href}
                className="mt-6 inline-flex h-[50px] w-[190px] items-center justify-center rounded-[6px] lg:mt-9 lg:h-[52px] bg-black text-base font-medium text-white transition-opacity duration-fast hover:opacity-85"
              >
                {slide.cta}
              </Link>
            </div>

            {/* dash pagination — the active dash fills left to right over
                the slide's dwell time, like the reference's progress line. */}
            <div className="mt-[38px] flex items-center gap-3">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className="py-2"
                >
                  <span className="relative block h-[2px] w-10 overflow-hidden rounded-full bg-black/20">
                    {i === index && (
                      <span
                        key={index}
                        className="hero-dash-fill absolute inset-y-0 left-0 bg-black"
                        style={{
                          animationDuration: `${AUTOPLAY_MS - 200}ms`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ratings pill */}
          {/* Clears the artwork's right edge, as the reference's rating card
              overlaps only the far corner of its product block. */}
          <div className="absolute right-[3%] top-[370px] z-10 hidden origin-top-right scale-[0.85] lg:block">
            <RatingCard />
          </div>

          {/* ---- proof strip: frosted band over the artwork, scrolling -- */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-[60px] bg-white/70 backdrop-blur-[2px]">
            <div className="mask-fade-x flex h-full items-center overflow-hidden">
              <div className="marquee-track animate-marquee-slow hover:[animation-play-state:paused]">
                {[0, 1].map((dup) => (
                  <ul
                    key={dup}
                    aria-hidden={dup === 1}
                    className="flex shrink-0 items-center gap-[76px] pr-[76px] text-black"
                  >
                    {PROOF.map((p) => (
                      <li key={p.key} className="whitespace-nowrap leading-none">
                        {p.node}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 rounded-pill bg-white px-4 py-2.5 text-[12px] text-black shadow-tile lg:hidden">
        <span className="flex items-center gap-1.5">
          <TileStars value={4.8} />
          <strong className="font-semibold">4.8</strong>
        </span>
        <span className="h-4 w-px bg-grey-300" aria-hidden />
        <span>
          <strong className="font-semibold">100%</strong> batches tested
        </span>
      </div>
    </section>
  );
}
