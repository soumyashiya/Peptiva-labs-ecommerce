"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { ApiError, getOrdersByEmail, type OrderRow } from "@/lib/api";
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

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

// The API sometimes returns the payment method as an object (gateway payload)
// instead of a plain code, which used to render as "[object Object]". Pull the
// readable bit out and map the raw codes onto words a customer understands.
const PAYMENT_LABELS: Record<string, string> = {
  manual: "Bank transfer",
  bank: "Bank transfer",
  bank_transfer: "Bank transfer",
  banktransfer: "Bank transfer",
  wire: "Bank transfer",
  card: "Card payment",
  credit_card: "Card payment",
  stripe: "Card payment",
  paypal: "PayPal",
  crypto: "Crypto",
  usdt: "Crypto (USDT)",
  wallet: "Wallet credit",
  cod: "Cash on delivery",
};

function paymentMethodLabel(method: unknown): string {
  if (method && typeof method === "object") {
    const o = method as Record<string, unknown>;
    const inner = o.name ?? o.label ?? o.title ?? o.type ?? o.method ?? o.code;
    return inner ? paymentMethodLabel(inner) : "Bank transfer";
  }
  const raw = String(method ?? "").trim();
  if (!raw) return "Bank transfer";
  const key = raw.toLowerCase().replace(/[\s-]+/g, "_");
  if (PAYMENT_LABELS[key]) return PAYMENT_LABELS[key];
  // Unknown code — show it as words rather than a raw slug.
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusStyles(status: string): string {
  const s = (status || "").toLowerCase();
  if (["completed", "paid", "received", "shipped", "delivered"].includes(s)) {
    return "border-leaf-800/25 bg-tint-sage text-leaf-800";
  }
  if (["rejected", "failed", "cancelled"].includes(s)) {
    return "border-alert-500/30 bg-alert-50 text-alert-500";
  }
  return "border-grey-200 bg-white text-grey-700";
}

export default function TrackOrderPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  // Auto-fill and auto-search when a user is signed in.
  useEffect(() => {
    if (user?.email && !prefilled) {
      setEmail(user.email);
      setPrefilled(true);
      void lookup(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, prefilled]);

  async function lookup(overrideEmail?: string) {
    const target = (overrideEmail ?? email).trim();
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const r = await getOrdersByEmail(target);
      setOrders(r.orders || []);
    } catch (e) {
      setOrders(null);
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pb-24 pt-28 sm:pt-32">
        <div className="shell">
          <p className="text-small uppercase tracking-caps text-grey-600">
            Peptiva Labs · Order lookup
          </p>
          <h1 className="mt-2 text-h1 font-normal text-black">
            Track your order
          </h1>
          <p className="mt-4 max-w-xl text-base text-grey-700">
            Enter the email you used at checkout to see the latest status,
            tracking and totals for every Peptiva Labs order on your account.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void lookup();
            }}
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@lab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-grey-200 bg-white px-4 py-3 text-base text-black outline-none transition-colors placeholder:text-grey-600 focus:border-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center disabled:opacity-60"
            >
              {loading ? "Looking up…" : "Look up orders"}
            </button>
          </form>

          {error && (
            <p className="mt-6 max-w-xl rounded-xl border border-alert-500/30 bg-alert-50 px-4 py-2.5 text-small text-alert-500">
              {error}
            </p>
          )}

          {orders !== null && (
            <div className="mt-10">
              {orders.length === 0 ? (
                <div className="rounded-lg border border-grey-200 bg-white p-8 text-center">
                  <p className="text-base text-grey-700">
                    No orders found for that email.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-grey-200 border-y border-grey-200">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/orders/${encodeURIComponent(o.order_number)}`}
                        className="grid grid-cols-1 gap-3 py-5 transition-colors hover:bg-white/50 sm:grid-cols-[1fr_auto] sm:items-center"
                      >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-medium text-black">
                            {o.order_number}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-small font-medium uppercase tracking-caps ${statusStyles(
                              o.status
                            )}`}
                          >
                            {o.status || "pending"}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-small font-medium uppercase tracking-caps ${statusStyles(
                              o.payment_status
                            )}`}
                          >
                            Payment: {o.payment_status || "pending"}
                          </span>
                        </div>
                        <p className="mt-1 text-small text-grey-600">
                          Placed {formatDate(o.created_at)}
                          {o.tracking_number
                            ? ` · Tracking: ${o.tracking_number}`
                            : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-medium text-black">
                          {formatUSD(toNumber(o.total))}
                        </p>
                        <p className="mt-0.5 text-small text-grey-600">
                          via {paymentMethodLabel(o.payment_method)}
                        </p>
                      </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {orders === null && !error && !loading && (
            <p className="mt-8 text-small text-grey-700">
              Or{" "}
              <Link
                href="/login"
                className="text-black underline underline-offset-2 hover:opacity-70"
              >
                sign in
              </Link>{" "}
              to auto-load your orders.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
