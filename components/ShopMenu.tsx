"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/lib/products";
import { ArrowRightLong } from "./icons";

/**
 * Desktop "Shop" mega menu, modelled on the reference: three underlined
 * tabs (by category / by research goal / by product), a list on the left
 * that previews its products on the right as photo tiles, and a black
 * "Bundle and save" bar. Hovering a left-hand item swaps the tiles; every
 * item and tile is a normal link, so it also works by keyboard.
 */

type Item = { label: string; href: string; pick: (p: Product) => boolean };

const orderable = PRODUCTS.filter((p) => !p.comingSoon);
const bestSlugs = ["glow", "bpc-157-tb-500", "tirzepatide", "retatrutide-40mg", "nad-plus-1000mg"];

const TABS: { label: string; items: Item[] }[] = [
  {
    label: "by category",
    items: [
      { label: "Shop all", href: "/products", pick: () => true },
      { label: "Best sellers", href: "/products", pick: (p) => bestSlugs.includes(p.slug) },
      { label: "Research peptides", href: "/products", pick: (p) => p.category === "Research Peptide" },
      { label: "Research blends", href: "/products?category=blends", pick: (p) => p.category === "Research Blend" },
      { label: "Research compounds", href: "/products", pick: (p) => p.category === "Research Compound" },
      { label: "Coming soon", href: "/products", pick: (p) => !!p.comingSoon },
    ],
  },
  {
    label: "by research goal",
    items: [
      { label: "Metabolic", href: "/products?category=metabolic", pick: (p) => !!p.tags?.includes("Metabolic") },
      { label: "Recovery", href: "/products?category=recovery", pick: (p) => !!p.tags?.includes("Recovery") },
      { label: "Skin & hair", href: "/products?category=skin-hair", pick: (p) => !!p.tags?.includes("Skin & hair") },
      { label: "Anti-ageing", href: "/products?category=anti-ageing", pick: (p) => !!p.tags?.includes("Anti-ageing") },
      { label: "Energy", href: "/products?category=energy", pick: (p) => !!p.tags?.includes("Energy") },
      { label: "Blends", href: "/products?category=blends", pick: (p) => !!p.tags?.includes("Blends") },
    ],
  },
  {
    label: "by product",
    items: PRODUCTS.map((p) => ({
      label: p.name,
      href: `/products/${p.slug}`,
      pick: (q: Product) => q.slug === p.slug,
    })),
  },
];

const photoOf = (p: Product) => p.hoverImg ?? p.cardImg ?? p.img;

export default function ShopMenu({ onNavigate }: { onNavigate: () => void }) {
  const [tab, setTab] = useState(0);
  const [hover, setHover] = useState(0);
  const items = TABS[tab].items;
  const active = items[Math.min(hover, items.length - 1)];

  const tiles = useMemo(() => {
    // "Shop all" / single products fall back to the full range so the grid
    // is never a lone tile.
    const pool = active.label === "Coming soon" ? PRODUCTS : orderable;
    const list = pool.filter(active.pick);
    return (list.length > 1 ? list : tab === 2 ? [...list, ...orderable.filter((p) => !list.includes(p))] : list).slice(0, 6);
  }, [active, tab]);

  return (
    <div className="grid w-[min(980px,calc(100vw-160px))] grid-cols-[260px_1fr] gap-x-10 rounded-[24px] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
      {/* ---- tabs ---- */}
      <div className="col-span-2 flex gap-8" role="tablist" aria-label="Browse the shop">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === tab}
            onMouseEnter={() => {
              setTab(i);
              setHover(0);
            }}
            onFocus={() => {
              setTab(i);
              setHover(0);
            }}
            className={`pb-0.5 text-[14px] text-black ${
              i === tab ? "border-b border-black" : "border-b border-transparent text-black/70 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- left list ---- */}
      <ul className="mt-7 max-h-[380px] space-y-1 overflow-y-auto pr-2">
        {items.map((it, i) => (
          <li key={it.label}>
            <Link
              href={it.href}
              onClick={onNavigate}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className={`block py-1.5 text-[17px] font-light transition-colors ${
                it === active ? "text-black" : "text-black/55 hover:text-black"
              }`}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ---- product tiles ---- */}
      <div className="mt-7">
        {tiles.length === 0 ? (
          <p className="pt-6 text-small text-grey-600">Nothing here yet.</p>
        ) : (
          <ul className="grid grid-cols-3 gap-x-6 gap-y-7">
            {tiles.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} onClick={onNavigate} className="group block">
                  <span className="relative block aspect-[170/103] overflow-hidden bg-[#F7F4F1]">
                    <Image
                      src={photoOf(p)}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover transition-transform duration-base ease-out group-hover:scale-[1.04]"
                    />
                    {p.comingSoon && (
                      <span className="absolute left-2 top-2 rounded-pill bg-black px-2 py-0.5 text-[9px] font-semibold uppercase tracking-label text-white">
                        Coming soon
                      </span>
                    )}
                  </span>
                  <span className="mt-2.5 block text-center text-[14px] text-black">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---- bundle bar ---- */}
      <Link
        href="/products#bundles"
        onClick={onNavigate}
        className="mt-8 flex h-[52px] items-center justify-between rounded-[10px] bg-black px-10 text-[17px] text-white transition-opacity hover:opacity-85"
      >
        Bundle and save
        <ArrowRightLong width={20} height={20} />
      </Link>
    </div>
  );
}
