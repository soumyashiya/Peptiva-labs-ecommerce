"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "@/components/icons";
import {
  ApiError,
  getOrder,
  type OrderItemRow,
  type OrderRow,
  type PaymentRow,
} from "@/lib/api";
import { formatUSD } from "@/lib/products";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

function statusStyles(status: string): string {
  const s = (status || "").toLowerCase();
  if (["completed", "paid", "received", "shipped", "delivered", "success"].includes(s)) {
    return "border-leaf-800/25 bg-tint-sage text-leaf-800";
  }
  if (["rejected", "failed", "cancelled", "declined"].includes(s)) {
    return "border-alert-500/30 bg-alert-50 text-alert-500";
  }
  return "border-grey-200 bg-white text-grey-700";
}

export default function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const orderNumber = decodeURIComponent(params.orderNumber);
  const [data, setData] = useState<{
    order: OrderRow;
    items: OrderItemRow[];
    payments: PaymentRow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(orderNumber)
      .then(setData)
      .catch((e) => {
        setError(
          e instanceof ApiError
            ? e.status === 404
              ? "Order not found"
              : e.message
            : "Failed to load order"
        );
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <>
      <Navbar />
      <main className="bg-white pb-24 pt-28 sm:pt-32">
        <div className="shell">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 text-small text-grey-700 transition-colors hover:text-black"
          >
            <ArrowLeft /> Back to orders
          </Link>

          {loading && (
            <p className="mt-8 text-base text-grey-700">Loading order…</p>
          )}

          {error && (
            <div className="mt-8 max-w-xl rounded-lg border border-grey-200 bg-white p-8">
              <p className="text-base font-medium text-black">
                Couldn&rsquo;t open this order
              </p>
              <p className="mt-2 text-base text-grey-700">{error}</p>
              <Link href="/track-order" className="btn-primary mt-6">
                Look up your orders
              </Link>
            </div>
          )}

          {data && (
            <>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-small uppercase tracking-caps text-grey-600">
                    Peptiva Labs · Order
                  </p>
                  <h1 className="mt-2 text-h1 font-normal text-black">
                    {data.order.order_number}
                  </h1>
                  <p className="mt-2 text-small text-grey-600">
                    Placed {formatDate(data.order.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center rounded-pill border px-3 py-1 text-small font-medium uppercase tracking-caps ${statusStyles(
                      data.order.status
                    )}`}
                  >
                    {data.order.status || "pending"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-pill border px-3 py-1 text-small font-medium uppercase tracking-caps ${statusStyles(
                      data.order.payment_status
                    )}`}
                  >
                    Payment: {data.order.payment_status || "pending"}
                  </span>
                </div>
              </div>

              {data.order.tracking_number && (
                <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg bg-sand-100 px-5 py-4">
                  <p className="text-small uppercase tracking-caps text-grey-600">
                    Tracking
                  </p>
                  <p className="text-base font-medium text-black">
                    {data.order.tracking_number}
                  </p>
                </div>
              )}

              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Items + payments */}
                <div className="lg:col-span-7">
                  <section className="rounded-lg border border-grey-200 bg-white p-6 sm:p-8">
                    <p className="text-small uppercase tracking-caps text-grey-600">
                      Items
                    </p>
                    <ul className="mt-5 divide-y divide-grey-200 border-y border-grey-200">
                      {data.items.map((it) => (
                        <li
                          key={it.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="min-w-0 pr-4">
                            <p className="truncate text-base font-medium text-black">
                              {it.name}
                            </p>
                            <p className="text-small text-grey-600">
                              Qty {it.quantity} ·{" "}
                              {formatUSD(toNumber(it.unit_price))} each
                              {it.sku ? ` · ${it.sku}` : ""}
                            </p>
                          </div>
                          <span className="text-base font-medium text-black">
                            {formatUSD(toNumber(it.line_total))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="mt-8 rounded-lg border border-grey-200 bg-white p-6 sm:p-8">
                    <p className="text-small uppercase tracking-caps text-grey-600">
                      Payments
                    </p>
                    {data.payments.length === 0 ? (
                      <p className="mt-4 text-small text-grey-700">
                        No payments recorded yet.
                      </p>
                    ) : (
                      <ol className="mt-5 space-y-4">
                        {data.payments.map((p) => (
                          <li
                            key={p.id}
                            className="flex items-start justify-between gap-3 rounded-xl bg-sand-100 p-4"
                          >
                            <div>
                              <p className="text-small font-medium text-black">
                                {p.provider} · {p.provider_id}
                              </p>
                              <p className="mt-0.5 text-small text-grey-600">
                                {formatDateTime(p.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-small font-medium text-black">
                                {formatUSD(toNumber(p.amount))}
                              </p>
                              <span
                                className={`mt-1 inline-flex items-center rounded-pill border px-2 py-0.5 text-small font-medium uppercase tracking-caps ${statusStyles(
                                  p.status
                                )}`}
                              >
                                {p.status}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                </div>

                {/* Totals */}
                <aside className="lg:col-span-5">
                  <div className="rounded-lg bg-sand-100 p-6 sm:p-8 lg:sticky lg:top-28">
                    <p className="text-small uppercase tracking-caps text-grey-600">
                      Totals
                    </p>
                    <div className="mt-5 flex items-center justify-between text-base text-grey-700">
                      <span>Subtotal</span>
                      <span className="font-medium text-black">
                        {formatUSD(toNumber(data.order.subtotal))}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-base text-grey-700">
                      <span>Shipping</span>
                      <span className="font-medium text-black">
                        {formatUSD(toNumber(data.order.shipping))}
                      </span>
                    </div>
                    {toNumber(data.order.discount_amount) > 0 && (
                      <div className="mt-3 flex items-center justify-between text-base text-grey-700">
                        <span>Discount</span>
                        <span className="font-medium text-black">
                          −{formatUSD(toNumber(data.order.discount_amount))}
                        </span>
                      </div>
                    )}
                    <div className="mt-5 flex items-center justify-between border-t border-grey-200 pt-5">
                      <span className="text-base font-medium text-black">
                        Total
                      </span>
                      <span className="text-h3 font-normal text-black">
                        {formatUSD(toNumber(data.order.total))}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link href="/track-order" className="btn-primary w-full justify-center">
                        Look up another order
                      </Link>
                      <Link
                        href="/products"
                        className="inline-flex w-full items-center justify-center rounded-pill border border-grey-200 bg-white px-5 py-2.5 text-base font-medium text-black transition-colors hover:bg-white"
                      >
                        Shop the Peptiva Labs range
                      </Link>
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
