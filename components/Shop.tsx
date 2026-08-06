"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, priceLabel, type Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/Toast";
import { ArrowUpRight, ShieldIcon, TruckIcon, BeakerIcon } from "@/components/icons";

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  function quickAdd() {
    setBusy(true);
    add(product.slug, 1);
    toast.success(`${product.name} added to your cart.`, "Added to cart");
    window.setTimeout(() => setBusy(false), 400);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow duration-300 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-mute">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.janoshik && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill bg-white/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-label text-ink shadow-soft">
              <ShieldIcon width={12} height={12} /> Lab verified
            </span>
          )}
        </div>
      </Link>

      <div className={`flex flex-1 flex-col p-5 ${product.bg}`}>
        <p className="text-[11px] uppercase tracking-label text-ink-muted">
          {product.category} · {product.meta}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 text-[17px] font-medium leading-tight text-ink transition-colors group-hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink-secondary">
          {product.blurb}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[15px] font-medium text-ink">
            {priceLabel(product)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={quickAdd}
              disabled={busy}
              className="rounded-pill border border-ink/15 bg-white px-3.5 py-2 text-[12px] font-medium text-ink transition-colors hover:bg-canvas disabled:opacity-50"
            >
              {busy ? "Added" : "Quick add"}
            </button>
            <Link
              href={`/products/${product.slug}`}
              aria-label={`View ${product.name}`}
              className="arrow-btn shrink-0 transition-transform group-hover:rotate-45"
            >
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <>
      <section className="section-block bg-canvas pb-8 pt-28 sm:pt-32">
        <div className="container-fluid">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Shop</span>
          </nav>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-[clamp(32px,5vw,56px)] font-medium leading-[1.05] tracking-tight2 text-ink">
                The full range
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-secondary">
                {PRODUCTS.length} research-grade formulations, each third-party
                tested, sealed, and cold-stored before it leaves the shelf.
              </p>
            </div>

            <ul className="flex flex-wrap gap-4 text-[13px] text-ink-secondary">
              <li className="inline-flex items-center gap-1.5">
                <ShieldIcon width={16} height={16} className="text-ink" />
                Janoshik verified
              </li>
              <li className="inline-flex items-center gap-1.5">
                <BeakerIcon width={16} height={16} className="text-ink" />
                Sealed &amp; tamper-evident
              </li>
              <li className="inline-flex items-center gap-1.5">
                <TruckIcon width={16} height={16} className="text-ink" />
                Cold-chain shipping
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block bg-canvas pb-20 sm:pb-28">
        <div className="container-fluid">
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <aside
            aria-label="Research-use compliance disclaimer"
            className="mt-16 rounded-card border border-line bg-white p-5 sm:p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-label text-ink">
              For research purposes only
            </p>
            <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink-secondary">
              Not intended for human or veterinary use. Not intended to
              diagnose, treat, cure, or prevent any disease. Products are
              supplied strictly for laboratory and analytical research
              conducted by qualified professionals. By purchasing, you confirm
              you are ordering these products for research use only.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
