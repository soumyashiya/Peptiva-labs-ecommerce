"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { getOrdersByEmail, getWallet, type OrderRow } from "@/lib/api";
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

export default function AccountPage() {
  const router = useRouter();
  const { user, hydrated, logout } = useAuth();

  const [balance, setBalance] = useState<number | null>(null);
  const [walletState, setWalletState] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersState, setOrdersState] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login?next=/account");
      return;
    }

    // Load each section independently — never block the whole page.
    getWallet()
      .then((w) => {
        setBalance(w.balance);
        setWalletState("ready");
      })
      .catch(() => setWalletState("error"));

    getOrdersByEmail(user.email)
      .then((r) => {
        setOrders((r.orders || []).slice(0, 5));
        setOrdersState("ready");
      })
      .catch(() => setOrdersState("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user]);

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="bg-white pb-24 pt-28 sm:pt-32">
          <div className="shell">
            <p className="text-base text-grey-700">Loading…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  if (!user) return null;

  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <Navbar />
      <main className="bg-white pb-24 pt-28 sm:pt-32">
        <div className="shell">
          {/* Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-[24px] font-medium text-white sm:h-20 sm:w-20 sm:text-[28px]">
                {initial}
              </span>
              <div>
                <p className="text-small uppercase tracking-caps text-grey-600">
                  Welcome back to Peptiva Labs
                </p>
                <h1 className="mt-1 text-h2 font-normal text-black">
                  {user.name || user.email}
                </h1>
                <p className="mt-1 text-small text-grey-600">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-secondary">
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-pill border border-grey-200 bg-white px-5 py-2.5 text-base font-medium text-black transition-colors hover:bg-white"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <StatCard
              eyebrow="Wallet balance"
              value={
                walletState === "loading"
                  ? "…"
                  : walletState === "error"
                    ? "—"
                    : formatUSD(balance ?? 0)
              }
              hint={
                walletState === "error"
                  ? "Balance unavailable right now"
                  : "Applied automatically at checkout"
              }
              accent
            />
            <StatCard
              eyebrow="Orders"
              value={
                ordersState === "loading"
                  ? "…"
                  : ordersState === "error"
                    ? "—"
                    : String(orders.length)
              }
              hint={
                ordersState === "error"
                  ? "Order history unavailable"
                  : orders.length > 0
                    ? `Latest ${formatDate(orders[0].created_at)}`
                    : "No orders yet"
              }
            />
            <StatCard
              eyebrow="Account"
              value={new Date().getFullYear().toString()}
              hint={
                user.role === "admin"
                  ? "Peptiva Labs admin account"
                  : "Peptiva Labs research account"
              }
            />
          </div>

          {/* Profile + Orders */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Profile */}
            <section className="lg:col-span-5">
              <div className="rounded-lg bg-white p-6 sm:p-8 border border-grey-200">
                <div className="flex items-center justify-between">
                  <p className="text-small uppercase tracking-caps text-grey-600">
                    Profile
                  </p>
                  <span className="text-small uppercase tracking-caps text-grey-600">
                    {user.role || "user"}
                  </span>
                </div>
                <dl className="mt-5 divide-y divide-grey-200">
                  <ProfileRow label="Full name" value={user.name} />
                  <ProfileRow label="Email" value={user.email} />
                  <ProfileRow
                    label="Phone"
                    value={user.phone || "Not provided"}
                    muted={!user.phone}
                  />
                  <ProfileRow
                    label="Date of birth"
                    value={
                      user.date_of_birth
                        ? formatDate(user.date_of_birth)
                        : "Not provided"
                    }
                    muted={!user.date_of_birth}
                  />
                  <ProfileRow
                    label="Nationality"
                    value={user.nationality || "Not provided"}
                    muted={!user.nationality}
                  />
                  <ProfileRow
                    label="Country of residence"
                    value={user.country_of_residence || "Not provided"}
                    muted={!user.country_of_residence}
                  />
                </dl>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-grey-200 pt-5">
                  <Link
                    href="/forgot-password"
                    className="text-small text-grey-700 underline-offset-4 transition-colors hover:text-black hover:underline"
                  >
                    Change password
                  </Link>
                </div>
              </div>
            </section>

            {/* Recent orders */}
            <section className="lg:col-span-7">
              <div className="rounded-lg border border-grey-200 bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-small uppercase tracking-caps text-grey-600">
                    Recent orders
                  </p>
                  <Link
                    href="/track-order"
                    className="text-small text-grey-700 transition-colors hover:text-black"
                  >
                    View all →
                  </Link>
                </div>

                {ordersState === "loading" ? (
                  <ul className="mt-5 divide-y divide-grey-200 border-y border-grey-200">
                    {[0, 1, 2].map((i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[1fr_auto] items-center gap-2 py-4"
                      >
                        <div className="space-y-2">
                          <div className="h-3 w-40 animate-pulse rounded bg-grey-200" />
                          <div className="h-2.5 w-24 animate-pulse rounded bg-grey-200" />
                        </div>
                        <div className="h-3 w-16 animate-pulse rounded bg-grey-200" />
                      </li>
                    ))}
                  </ul>
                ) : ordersState === "error" ? (
                  <p className="mt-5 text-small text-grey-700">
                    Couldn&rsquo;t load your orders. Try refreshing in a moment.
                  </p>
                ) : orders.length === 0 ? (
                  <div className="mt-5 rounded-xl bg-sand-100 p-8 text-center">
                    <p className="text-base font-medium text-black">
                      No orders yet
                    </p>
                    <p className="mt-2 text-small text-grey-700">
                      Once you place your first order it will show up here.
                    </p>
                    <Link href="/products" className="btn-primary mt-5">
                      Browse the catalogue
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-5 divide-y divide-grey-200 border-y border-grey-200">
                    {orders.map((o) => (
                      <li key={o.id}>
                        <Link
                          href={`/orders/${encodeURIComponent(o.order_number)}`}
                          className="grid grid-cols-1 gap-2 rounded-lg py-4 transition-colors hover:bg-white sm:grid-cols-[1fr_auto] sm:items-center"
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
                            </div>
                            <p className="mt-1 text-small text-grey-600">
                              {formatDate(o.created_at)}
                              {o.tracking_number
                                ? ` · Tracking ${o.tracking_number}`
                                : ""}
                            </p>
                          </div>
                          <p className="text-right text-base font-medium text-black">
                            {formatUSD(toNumber(o.total))}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatCard({
  eyebrow,
  value,
  hint,
  accent = false,
}: {
  eyebrow: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-6 sm:p-7 ${
        accent
          ? "bg-black text-white"
          : "border border-grey-200 bg-white text-black"
      }`}
    >
      <p
        className={`text-small uppercase tracking-caps ${accent ? "text-white/60" : "text-grey-600"}`}
      >
        {eyebrow}
      </p>
      <p
        className={`mt-3 text-h2 font-normal  ${accent ? "text-white" : "text-black"}`}
      >
        {value}
      </p>
      <p
        className={`mt-2 text-small ${accent ? "text-white/70" : "text-grey-700"}`}
      >
        {hint}
      </p>
    </div>
  );
}

function ProfileRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-small text-grey-700">{label}</dt>
      <dd
        className={`text-right text-base ${muted ? "text-grey-600" : "font-medium text-black"}`}
      >
        {value}
      </dd>
    </div>
  );
}
