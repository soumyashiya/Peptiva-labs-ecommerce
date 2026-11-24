"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { isPhoto, priceLabel, type Product } from "@/lib/products";
import { useCart } from "./CartContext";
import { useToast } from "./Toast";
import Rating from "./Rating";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

/**
 * Catalogue product card, in the reference storefront's two forms.
 *
 * `rail` — the carousel form. A tinted square tile holds the render, and the
 * name, star row and price sit as plain text below it on the page ground. No
 * border, no shadow, no coloured price.
 *
 * `grid` — the collection form. The whole card is one tall tinted panel with
 * the text stacked inside it: name and stars at the top, micro-links, the
 * render floating in the middle, then the blurb and an outlined CTA pinned to
 * the bottom so every card in a row ends on the same line.
 */
export default function ProductCard({
  product,
  variant = "rail",
  priority = false,
  badge,
  hoverOnly = false,
}: {
  product: Product;
  variant?: "rail" | "grid";
  priority?: boolean;
  badge?: string;
  /** Show the lifestyle (hover) shot outright, with no cross-fade. */
  hoverOnly?: boolean;
}) {
  const { add } = useCart();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  function quickAdd() {
    if (busy) return;
    setBusy(true);
    add(product.slug, 1);
    toast.success(`${product.name} added to your cart.`, "Added to cart");
    window.setTimeout(() => setBusy(false), 900);
  }

  const href = `/products/${product.slug}`;

  // An explicit badge still wins; otherwise new arrivals label themselves.
  const corner = badge ?? (product.newArrival ? "New" : undefined);

  /* ---- rail form ---------------------------------------------------- */
  if (variant === "rail") {
    // `hoverOnly` promotes the lifestyle shot to the resting image, so there
    // is nothing left to cross-fade to.
    const railImg = hoverOnly
      ? product.hoverImg ?? product.cardImg ?? product.img
      : product.cardImg ?? product.img;
    const railCover = hoverOnly ? !!(product.hoverImg ?? product.cardImg) : !!product.cardImg;
    const crossFade = !hoverOnly && product.hoverImg;

    return (
      <article className="group flex h-full flex-col">
        <Link
          href={href}
          className="relative block aspect-[4/5] overflow-hidden rounded-[30px]"
          style={{ background: "linear-gradient(180deg, #F8F6F5 0%, #F5F1F8 60%, #F1EAFB 100%)" }}
        >
          <Image
            src={railImg}
            alt={product.name}
            fill
            priority={priority}
            quality={90}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
            className={`transition-[transform,opacity] duration-base ease-out group-hover:scale-[1.04] ${
              railCover ? "object-cover" : "object-contain p-4 sm:p-5"
            } ${crossFade ? "group-hover:opacity-0" : ""}`}
          />
          {crossFade && (
            <Image
              src={product.hoverImg!}
              alt=""
              fill
              quality={90}
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
              className="object-cover opacity-0 transition-[transform,opacity] duration-base ease-out group-hover:scale-[1.04] group-hover:opacity-100"
            />
          )}
          {corner && <Badge label={corner} />}
          {product.comingSoon && (
            <span className="absolute left-4 top-4 rounded-pill bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-label text-white">
              Coming soon
            </span>
          )}
        </Link>

        {/* Measured: title 20/32 regular with 5px beneath, then the star row
            and the price, all on the page ground. */}
        <div className="flex flex-1 flex-col px-5 pt-[22px]">
          <h3 className="text-[20px] font-normal leading-8 text-black">
            <Link href={href} className="transition-opacity hover:opacity-60">
              {product.name}
            </Link>
          </h3>

          {product.rating !== undefined && (
            <Rating
              value={product.rating}
              count={product.reviews?.toLocaleString("en-US")}
              size={20}
              className="mt-2 gap-2.5"
              countClassName="text-[14px] font-medium text-grey-650"
            />
          )}

          <p className="mt-3 text-[20px] font-medium leading-[30px] text-black">
            {priceLabel(product)}
          </p>
        </div>
      </article>
    );
  }

  /* ---- grid form ---------------------------------------------------- */
  return (
    <article
      className="group relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#FBF2F4_0%,#F3E7EB_100%)] p-6"
    >
      {corner && <Badge label={corner} />}

      <h3 className="pr-14 text-[20px] font-normal leading-tight text-black">
        <Link href={href} className="transition-opacity hover:opacity-60">
          {product.name}
        </Link>
      </h3>

      {product.rating !== undefined && (
        <Rating
          value={product.rating}
          count={product.reviews?.toLocaleString("en-US")}
          size={15}
          className="mt-2"
          countClassName="text-[12px] text-grey-700"
        />
      )}

      <div className="mt-2.5 flex flex-col items-start gap-0.5 text-[12px]">
        <Link href={`${href}#analysis`} className="link-micro">
          Certificate of analysis
        </Link>
        <Link href={`${href}#contents`} className="link-micro">
          What&apos;s in the kit
        </Link>
      </div>

      {product.shopImg ? (
        <Link href={href} className="relative -mx-6 my-3 block aspect-[13/10] overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_86%,transparent_100%),linear-gradient(to_right,transparent_0%,#000_7%,#000_93%,transparent_100%)] [-webkit-mask-composite:source-in]">
          <Image
            src={product.shopImg}
            alt={product.name}
            fill
            quality={95}
            priority={priority}
            sizes="(min-width: 1024px) 800px, (min-width: 640px) 100vw, 200vw"
            className="object-cover transition-transform duration-base ease-out group-hover:scale-[1.04]"
          />
        </Link>
      ) : (
      <CardGallery
        href={href}
        name={product.name}
        images={
          product.gallery?.length
            ? product.gallery.filter((g) => !isPhoto(g)).length
              ? product.gallery.filter((g) => !isPhoto(g))
              : [product.img]
            : [product.img]
        }
        priority={priority}
      />
      )}

      <p className="text-[13px] leading-[1.6] text-black">
        <span className="line-clamp-3">{product.blurb}</span>
      </p>

      {/* `mt-auto` keeps the action block flush with the card's bottom edge
          regardless of how long the blurb above it runs. */}
      <div className="mt-auto pt-5">
        <p className="text-[18px] font-normal text-black">{priceLabel(product)}</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link href={href} className="inline-flex h-[40px] items-center justify-center rounded-[10px] border border-black bg-white text-small text-black transition-colors hover:bg-black hover:text-white">
            Learn more
          </Link>
          {product.comingSoon ? (
            <Link href={`${href}#buy`} className="inline-flex h-[40px] items-center justify-center rounded-[10px] bg-black text-small font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-60">
              Register interest
            </Link>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              disabled={busy}
              className="inline-flex h-[40px] items-center justify-center rounded-[10px] bg-black text-small font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {busy ? "Added to cart" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/** Circular black corner badge, e.g. "NEW". */
/** Short labels ("New") sit in a round disc; longer ones ("Best seller",
 *  "Limited") become a pill. "Limited" takes a warm red so it reads as
 *  scarcity rather than a plain label. */
function Badge({ label }: { label: string }) {
  const round = label.length <= 4;
  const tone = /limited/i.test(label) ? "bg-[#D6204E]" : "bg-black";
  return (
    <span
      className={`absolute right-4 top-4 z-10 inline-flex items-center justify-center font-bold uppercase text-white ${tone} ${
        round ? "h-9 w-9 rounded-full text-[9px] tracking-caps" : "h-6 rounded-pill px-2.5 text-[9px] tracking-label"
      }`}
    >
      {label}
    </span>
  );
}

/**
 * Every image of the product inside the grid card: a swipeable snap strip
 * with dots, and arrows that appear on hover. Transparent renders sit
 * contained on the card's wash; photographs fill a rounded frame.
 */
function CardGallery({
  href,
  name,
  images,
  priority,
}: {
  href: string;
  name: string;
  images: string[];
  priority: boolean;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const el = strip.current;
    if (!el) return;
    const n = (i + images.length) % images.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="group/gal relative my-6">
      <div
        ref={strip}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
        className="no-scrollbar flex h-56 snap-x snap-mandatory overflow-x-auto sm:h-64"
        aria-label={`${name} images`}
      >
        {images.map((src, i) => {
          const photo = isPhoto(src);
          return (
            <Link
              key={src}
              href={href}
              className="relative h-full w-full flex-none snap-center"
              aria-label={i === 0 ? name : `${name}, image ${i + 1}`}
              tabIndex={i === index ? 0 : -1}
            >
              <span className={`absolute inset-0 ${photo ? "overflow-hidden rounded-xl" : ""}`}>
                <Image
                  src={src}
                  alt={i === 0 ? name : ""}
                  fill
                  priority={priority && i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={photo ? "object-cover" : "object-contain"}
                />
              </span>
            </Link>
          );
        })}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => goTo(index - 1)}
            className="absolute left-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-tile transition-opacity focus-visible:opacity-100 group-hover/gal:opacity-100"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => goTo(index + 1)}
            className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-tile transition-opacity focus-visible:opacity-100 group-hover/gal:opacity-100"
          >
            <ChevronRightIcon />
          </button>
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className="p-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    i === index ? "w-4 bg-black" : "w-1.5 bg-black/25"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
