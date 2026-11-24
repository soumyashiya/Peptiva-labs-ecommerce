"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import {
  PlusIcon,
  MinusIcon,
  ArrowLeft,
  CartIcon,
  LockIcon,
  TrashIcon,
} from "@/components/icons";
import { getProduct, formatUSD, type Product } from "@/lib/products";

const SHIPPING_FEE = 45;

/**
 * Cart.
 *
 * Restyled onto the reference's system: plain hairline-separated line items on
 * the page ground, a tinted summary panel on the right, and a single black
 * pill CTA. Pricing maths, cart mutations and the shipping constant are
 * unchanged from before the restyle.
 */
export default function CartPage() {
  const { items, hydrated, setQty, remove, clear } = useCart();

  const lines = items
    .map((i) => {
      const product = getProduct(i.slug);
      return product ? { ...i, product } : null;
    })
    .filter((l): l is { slug: string; qty: number; product: Product } => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const total = subtotal + (lines.length > 0 ? SHIPPING_FEE : 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pb-20 pt-28 lg:pt-32">
        <div className="shell">
          {!hydrated ? (
            <p className="py-20 text-center text-base text-grey-600">Loading…</p>
          ) : lines.length === 0 ? (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-lg bg-sand-100 p-10 text-center sm:p-14">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
                <CartIcon width={24} height={24} />
              </span>
              <h1 className="mt-6 text-h2 font-normal text-black">
                Your cart is empty
              </h1>
              <p className="mt-3 max-w-md text-base text-grey-700">
                Explore our catalogue of research-grade peptides, each supplied
                with full documentation.
              </p>
              <Link href="/products" className="btn-primary mt-8">
                Browse the catalogue
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="eyebrow">Your selection</p>
                <h1 className="heading-caps mt-3">Cart</h1>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                {/* ---- line items ---------------------------------- */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between">
                    <p className="text-base text-grey-700">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </p>
                    <button
                      type="button"
                      onClick={clear}
                      className="inline-flex items-center gap-2 text-small text-grey-700 transition-colors hover:text-black"
                    >
                      <TrashIcon width={15} height={15} />
                      Clear cart
                    </button>
                  </div>

                  <ul className="mt-4 divide-y divide-grey-200 border-y border-grey-200">
                    {lines.map((l) => (
                      <li
                        key={l.slug}
                        className="grid grid-cols-[88px_1fr] items-start gap-4 py-6 sm:grid-cols-[104px_1fr_auto] sm:gap-6"
                      >
                        <Link
                          href={`/products/${l.slug}`}
                          className={`relative h-[88px] w-[88px] overflow-hidden rounded-lg sm:h-[104px] sm:w-[104px] ${l.product.bg}`}
                        >
                          <Image
                            src={l.product.img}
                            alt={l.product.name}
                            fill
                            sizes="104px"
                            className="object-contain p-2"
                          />
                        </Link>

                        <div className="min-w-0">
                          <p className="text-small text-grey-600">
                            {l.product.category}
                          </p>
                          <Link
                            href={`/products/${l.slug}`}
                            className="mt-1 block text-h4 font-normal text-black transition-opacity hover:opacity-60"
                          >
                            {l.product.name}
                          </Link>
                          <p className="mt-0.5 text-small text-grey-600">
                            {l.product.meta}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center rounded-md border border-grey-300">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQty(l.slug, l.qty - 1)}
                                className="inline-flex h-10 w-10 items-center justify-center text-black transition-colors hover:bg-grey-100"
                              >
                                <MinusIcon width={15} height={15} />
                              </button>
                              <span className="w-9 text-center text-base font-medium tabular-nums">
                                {l.qty}
                              </span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => setQty(l.slug, l.qty + 1)}
                                className="inline-flex h-10 w-10 items-center justify-center text-black transition-colors hover:bg-grey-100"
                              >
                                <PlusIcon width={15} height={15} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(l.slug)}
                              className="text-small text-grey-700 underline underline-offset-4 transition-colors hover:text-black"
                            >
                              Remove
                            </button>
                          </div>

                          {/* On narrow widths the price folds under the copy
                              rather than squeezing a third column. */}
                          <p className="mt-4 text-h4 font-medium text-black sm:hidden">
                            {formatUSD(l.product.price * l.qty)}
                          </p>
                        </div>

                        <div className="hidden text-right text-h4 font-medium text-black sm:block">
                          {formatUSD(l.product.price * l.qty)}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 text-base text-grey-700 transition-colors hover:text-black"
                  >
                    <ArrowLeft /> Continue shopping
                  </Link>
                </div>

                {/* ---- summary -------------------------------------- */}
                <aside className="lg:col-span-5">
                  <div className="rounded-lg bg-sand-100 p-6 sm:p-8 lg:sticky lg:top-32">
                    <p className="eyebrow">Order summary</p>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-base text-grey-700">
                        <span>
                          Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
                        </span>
                        <span className="font-medium text-black">
                          {formatUSD(subtotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-base text-grey-700">
                        <span>Shipping</span>
                        <span className="font-medium text-black">
                          {formatUSD(SHIPPING_FEE)}
                        </span>
                      </div>
                    </div>

                    {/* Label and figure share a baseline; the currency note
                        sits on its own line so it cannot shunt the total up. */}
                    <div className="mt-6 border-t border-grey-300 pt-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-h4 font-medium text-black">Total</span>
                        <span className="text-h3 font-medium text-black">
                          {formatUSD(total)}
                        </span>
                      </div>
                      <p className="mt-1 text-right text-small text-grey-600">
                        USD · tax included
                      </p>
                    </div>

                    <Link href="/checkout" className="btn-primary btn-block mt-6">
                      Proceed to checkout
                    </Link>

                    <p className="mt-4 flex items-center justify-center gap-2 text-small text-grey-600">
                      <LockIcon width={14} height={14} />
                      Secure, encrypted checkout
                    </p>

                    <div className="mt-6 rounded-lg bg-white p-5">
                      <p className="eyebrow">Research use only</p>
                      <p className="mt-2 text-small leading-relaxed text-grey-700">
                        By proceeding with this purchase, you acknowledge that
                        these products are supplied solely for laboratory
                        research and are not intended for human or veterinary
                        use. These products are not intended to diagnose, treat,
                        cure, or prevent any disease.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
