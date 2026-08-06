"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  ArrowUpRight,
  BeakerIcon,
  CloseIcon,
  PlusIcon,
  MinusIcon,
  ShieldIcon,
} from "@/components/icons";
import { priceLabel, type Product } from "@/lib/products";

type SpecTab = "package" | "storage";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { add } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img];
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<SpecTab>("package");
  const [labOpen, setLabOpen] = useState(false);

  useEffect(() => {
    if (!product.janoshik) return;
    if (typeof window === "undefined") return;
    const key = `janoshik-seen:${product.slug}`;
    if (window.sessionStorage.getItem(key)) return;
    const t = window.setTimeout(() => {
      setLabOpen(true);
      window.sessionStorage.setItem(key, "1");
    }, 600);
    return () => window.clearTimeout(t);
  }, [product.slug, product.janoshik]);

  useEffect(() => {
    if (!labOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLabOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [labOpen]);

  const tabs: { id: SpecTab; label: string; body?: string | string[] }[] = [
    { id: "package", label: "Package Contents", body: product.packageContents },
    { id: "storage", label: "Storage Logic", body: product.storageLogic },
  ];
  const activeTabBody = tabs.find((t) => t.id === tab)?.body;

  function handleAdd() {
    add(product.slug, qty);
    toast.success(
      qty > 1
        ? `${qty} × ${product.name} added to your cart.`
        : `${product.name} added to your cart.`,
      "Added to cart"
    );
  }

  return (
    <>
      <Navbar />
      <main id="home" className="section-block bg-canvas pb-20 pt-28 sm:pt-32">
        <div className="container-fluid">
          {/* Breadcrumb / back */}
          <nav aria-label="Breadcrumb">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[14px] text-ink-secondary transition-colors hover:text-ink"
            >
              <ArrowLeft /> Back to the range
            </Link>
          </nav>

          {/* Two-column: image left, details right */}
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-mute">
                <Image
                  src={gallery[activeImg] ?? product.img}
                  alt={`${product.name} — ${product.meta}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-opacity duration-300"
                />
              </div>
              {gallery.length > 1 && (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {gallery.map((src, i) => {
                    const isActive = i === activeImg;
                    return (
                      <button
                        key={src + i}
                        type="button"
                        aria-label={`View image ${i + 1} of ${gallery.length}`}
                        aria-current={isActive}
                        onClick={() => setActiveImg(i)}
                        className={`group relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-mute ring-1 transition-all sm:h-20 sm:w-24 ${
                          isActive
                            ? "ring-2 ring-ink"
                            : "ring-line hover:ring-ink/40"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${product.name} view ${i + 1}`}
                          fill
                          sizes="96px"
                          className={`object-cover transition-opacity ${
                            isActive
                              ? "opacity-100"
                              : "opacity-90 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-line bg-white px-3 py-1 text-[10px] uppercase tracking-label text-ink-secondary">
                Compound Analysis · {product.category}
              </span>
              <h1 className="mt-3 text-[clamp(24px,3vw,34px)] font-medium leading-[1.1] tracking-tight2 text-ink">
                {product.name}
              </h1>
              <p className="mt-1.5 text-[12px] uppercase tracking-label text-ink-muted">
                {product.meta}
              </p>
              <p className="mt-3 text-[20px] font-medium text-ink">
                {priceLabel(product)}
              </p>

              {product.description.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 max-w-prose text-[14px] leading-relaxed text-ink-secondary"
                >
                  {p}
                </p>
              ))}

              {/* Safety Protocol notice */}
              {product.safetyProtocol && (
                <div
                  role="note"
                  className="mt-4 flex max-w-prose items-start gap-2.5 rounded-2xl border border-line bg-surface-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-secondary"
                >
                  <ShieldIcon width={16} height={16} className="mt-0.5 shrink-0 text-ink" />
                  <p>
                    <strong className="font-semibold text-ink">Safety Protocol:</strong>{" "}
                    {product.safetyProtocol}
                  </p>
                </div>
              )}

              {/* Quantity + add to cart */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-pill border border-line bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
                  >
                    <MinusIcon width={16} height={16} />
                  </button>
                  <span
                    className="w-8 text-center text-[15px] font-medium"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
                  >
                    <PlusIcon width={16} height={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn-dark inline-flex items-center gap-2"
                >
                  Add to cart
                </button>

                {product.janoshik && (
                  <a
                    href={product.janoshik.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink underline-offset-4 transition-colors hover:underline"
                  >
                    View Janoshik Analytical Report
                    <ArrowUpRight width={14} height={14} />
                  </a>
                )}
              </div>

              {/* Janoshik Third-Party Lab Analysis card */}
              {product.janoshik && (
                <section
                  aria-labelledby="janoshik-heading"
                  className="mt-6 overflow-hidden rounded-card border border-line bg-white"
                >
                  <header className="border-b border-line px-5 py-4">
                    <h3
                      id="janoshik-heading"
                      className="text-[15px] font-medium text-ink"
                    >
                      Janoshik Third-Party Lab Analysis
                    </h3>
                    <p className="mt-0.5 text-[12px] text-ink-muted">
                      Independently tested and verified by Janoshik Analytical.
                    </p>
                  </header>

                  {/* Stat pills */}
                  <div className="grid grid-cols-2 divide-x divide-line border-b border-line sm:grid-cols-3">
                    <Stat label="Batch Number" value={product.janoshik.batch} />
                    <Stat label="Fill Volume" value={product.janoshik.fillVolume} />
                    {product.janoshik.purity && (
                      <Stat
                        label="Purity"
                        value={product.janoshik.purity}
                        className="col-span-2 border-t border-line sm:col-span-1 sm:border-t-0"
                      />
                    )}
                  </div>

                  {/* Compound table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[13px]">
                      <thead>
                        <tr className="bg-surface-soft text-left text-[11px] uppercase tracking-label text-ink-muted">
                          <th className="px-5 py-2.5 font-medium">Compound</th>
                          <th className="px-5 py-2.5 font-medium">Concentration</th>
                          <th className="px-5 py-2.5 font-medium">Verified Content</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.janoshik.rows.map((row) => (
                          <tr
                            key={row.compound}
                            className="border-t border-line text-ink"
                          >
                            <td className="px-5 py-3 font-medium">{row.compound}</td>
                            <td className="px-5 py-3 text-ink-secondary">
                              {row.concentration}
                            </td>
                            <td className="px-5 py-3 text-ink-secondary">
                              {row.verified}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-ink-muted">
                    Concentration is measured per ml; verified content reflects
                    the total assayed mass across the stated fill volume.
                  </p>
                </section>
              )}

              {/* Package / Storage / Supply tabs */}
              <section
                aria-label="Product logistics"
                className="mt-6 border-t border-line pt-4"
              >
                <div
                  role="tablist"
                  aria-label="Product logistics"
                  className="flex flex-wrap gap-2"
                >
                  {tabs.map((t) => {
                    const active = t.id === tab;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setTab(t.id)}
                        className={`rounded-pill border px-4 py-1.5 text-[12px] transition-colors ${
                          active
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-ink-secondary hover:border-ink/40 hover:text-ink"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  role="tabpanel"
                  className="mt-3 max-w-prose text-[13px] leading-relaxed text-ink-secondary"
                >
                  {Array.isArray(activeTabBody) ? (
                    <ul className="space-y-1.5">
                      {activeTabBody.map((line, i) => (
                        <li
                          key={i}
                          className={
                            i === 0
                              ? "text-ink"
                              : "flex items-start gap-2 before:mt-2 before:inline-block before:h-1.5 before:w-1.5 before:flex-none before:rounded-full before:bg-ink_btn"
                          }
                        >
                          {i === 0 ? line : <span>{line}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : activeTabBody ? (
                    <p>{activeTabBody}</p>
                  ) : (
                    <p className="text-ink-muted">Information coming soon.</p>
                  )}
                </div>
              </section>

              {/* Highlights */}
              <ul className="mt-6 grid grid-cols-1 gap-2 border-t border-line pt-4 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-[13px] text-ink-secondary"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-ink_btn" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-20 sm:mt-28" aria-labelledby="related-heading">
              <div className="flex items-end justify-between">
                <h2
                  id="related-heading"
                  className="text-[clamp(22px,2.6vw,32px)] font-medium tracking-tight2 text-ink"
                >
                  Related products
                </h2>
                <Link
                  href="/products"
                  className="text-[14px] text-ink-secondary transition-colors hover:text-ink"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group relative block overflow-hidden rounded-card bg-white"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-mute">
                      <Image
                        src={r.img}
                        alt={r.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 border border-t-0 border-line p-5">
                      <div>
                        <h3 className="text-[16px] font-medium text-ink">
                          {r.name}
                        </h3>
                        <p className="mt-1 text-[13px] text-ink-secondary">
                          {priceLabel(r)}
                        </p>
                      </div>
                      <span className="arrow-btn transition-transform group-hover:rotate-45">
                        <ArrowUpRight />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {product.janoshik && labOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="janoshik-modal-heading"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={() => setLabOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-card bg-white shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setLabOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-canvas"
            >
              <CloseIcon width={14} height={14} />
            </button>

            <div className="px-6 pb-6 pt-8 text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-nude-green">
                <BeakerIcon width={26} height={26} className="text-ink" />
              </div>
              <h2
                id="janoshik-modal-heading"
                className="mt-4 text-[18px] font-medium leading-tight tracking-tight2 text-ink"
              >
                Janoshik Third-Party Lab Analysis
              </h2>
              <p className="mt-1.5 text-[13px] text-ink-secondary">
                Independently tested and verified by Janoshik Analytical.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 px-6">
              <ModalStat label="Batch Number" value={product.janoshik.batch} />
              <ModalStat label="Fill Volume" value={product.janoshik.fillVolume} />
              <ModalStat
                label="Purity"
                value={product.janoshik.purity ?? "Verified"}
              />
            </div>

            <div className="mx-6 mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-surface-soft text-left text-[10px] uppercase tracking-label text-ink-muted">
                    <th className="px-3 py-2 font-medium">Compound</th>
                    <th className="px-3 py-2 text-center font-medium">Concentration</th>
                    <th className="px-3 py-2 text-right font-medium">Verified Content</th>
                  </tr>
                </thead>
                <tbody>
                  {product.janoshik.rows.map((row) => (
                    <tr key={row.compound} className="border-t border-line">
                      <td className="px-3 py-2.5 font-medium text-ink">{row.compound}</td>
                      <td className="px-3 py-2.5 text-center text-ink-secondary">
                        {row.concentration}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-ink">
                        {row.verified}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="px-6 pt-3 text-[12px] leading-relaxed text-ink-muted">
              Concentration is measured per ml; verified content reflects the
              total assayed mass across the stated fill volume.
            </p>

            <div className="p-6 pt-4">
              <a
                href={product.janoshik.verifyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-dark flex w-full items-center justify-center gap-2 text-center"
              >
                View Full Janoshik Report
                <ArrowUpRight width={16} height={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function ModalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-soft px-2.5 py-2.5 text-center">
      <p className="text-[9px] uppercase tracking-label text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-ink">{value}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`px-5 py-3 ${className}`}>
      <p className="text-[11px] uppercase tracking-label text-ink-muted">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-medium text-ink">{value}</p>
    </div>
  );
}
