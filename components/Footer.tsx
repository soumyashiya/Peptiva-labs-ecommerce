"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiError, newsletterSubscribe } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { PRODUCTS, priceLabel } from "@/lib/products";
import {
  Logo,
  UserIcon,
  TruckIcon,
  DocIcon,
  ChatIcon,
  ChevronRightIcon,
  ArrowRightLong,
  InstagramIcon,
  LinkedInIcon,
  TagIcon,
} from "./icons";

/**
 * Footer.
 *
 * Reference archetype ("footer v4"): a powder gradient ground; a white
 * "trending right now" card straddling the top edge with quick product links;
 * five link groups, the first with leading icons; a newsletter row with an
 * inline bordered input and an arrow "Join" affordance; then a bottom bar with
 * the wordmark, locale/payment chips and legal links.
 *
 * The newsletter submit path (validation, API call, toast copy and error
 * mapping) is carried over unchanged.
 */

type FooterLink = { label: string; href: string };

const GROUPS: { title: string; links: FooterLink[]; icons?: boolean }[] = [
  {
    title: "Help with your order",
    icons: true,
    links: [
      { label: "My account", href: "/account" },
      { label: "Track my order", href: "/track-order" },
      { label: "Delivery", href: "/shipping-policy" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Your cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Science",
    links: [
      { label: "BPC-157 + TB-500", href: "/products/bpc-157-tb-500" },
      { label: "Tirzepatide", href: "/products/tirzepatide" },
      { label: "Retatrutide", href: "/products/retatrutide" },
      { label: "Glow", href: "/products/glow" },
      { label: "NAD+", href: "/products/nad-plus-1000mg" },
    ],
  },
  {
    title: "Company & reviews",
    links: [
      { label: "About", href: "/about" },
      { label: "How we verify", href: "/science" },
      { label: "Customer reviews", href: "/reviews" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Shipping policy", href: "/shipping-policy" },
      { label: "Refund policy", href: "/refund-policy" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms-of-service" },
    ],
  },
];

const GROUP_ICONS = [UserIcon, TruckIcon, DocIcon, ChatIcon];

/* ---- trending card ---------------------------------------------------- */

function TrendingCard() {
  const picks = PRODUCTS.slice(0, 3);

  return (
    <div className="rounded-lg border border-grey-200 bg-white p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-10">
        <div className="self-center">
          <p className="eyebrow">Start with our best sellers</p>
          <p className="mt-2 text-h3 font-normal text-plum-700">
            Trending right now
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {picks.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group flex items-center gap-4 border-b border-grey-200 py-3 last:border-b-0 sm:last:border-b"
            >
              <span
                className={`relative h-11 w-11 flex-none overflow-hidden rounded-md ${p.bg}`}
              >
                <Image
                  src={p.img}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </span>
              <span className="min-w-0 flex-1 truncate text-base font-medium text-black">
                {p.name}
              </span>
              <span className="flex-none whitespace-nowrap text-small text-grey-600">
                {priceLabel(p)}
              </span>
              <ChevronRightIcon className="flex-none text-grey-600 transition-transform duration-fast ease-standard group-hover:translate-x-1" />
            </Link>
          ))}

          <Link
            href="/products"
            className="group flex items-center gap-4 border-b border-grey-200 py-3 last:border-b-0 sm:last:border-b"
          >
            <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-md bg-tint-lavender-50 text-plum-700">
              <TagIcon width={19} height={19} />
            </span>
            <span className="min-w-0 flex-1 truncate text-base font-medium text-black">
              Shop the full range
            </span>
            <ArrowRightLong
              width={18}
              height={18}
              className="flex-none text-black transition-transform duration-fast ease-standard group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---- newsletter ------------------------------------------------------- */

function NewsletterForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    if (!consent) {
      toast.error(
        "Please tick the consent box to receive research updates.",
        "Consent required"
      );
      return;
    }

    setBusy(true);
    try {
      const r = await newsletterSubscribe({
        email,
        consent,
        source: "footer",
        website,
      });
      if (r.already_subscribed) {
        toast.info(
          "You're already on the Peptiva Labs list — thanks.",
          "Already subscribed"
        );
      } else {
        toast.success(
          "You're subscribed. Watch your inbox for the next drop.",
          "Subscribed"
        );
      }
      setEmail("");
    } catch (err) {
      if (typeof console !== "undefined") console.error("newsletter failed:", err);
      const msg =
        err instanceof ApiError
          ? err.status === 400
            ? "Please enter a valid email address."
            : err.status === 429
              ? "Too many attempts. Please try again in a little while."
              : err.status >= 500
                ? "Our newsletter service is briefly unavailable. Please try again in a minute."
                : "We couldn't subscribe you right now. Please try again."
          : "We couldn't reach the newsletter service. Check your connection and try again.";
      toast.error(msg, "Subscription failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex items-center gap-2 rounded-md border border-grey-300 bg-white pl-4 pr-2">
        <input
          type="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-black outline-none placeholder:text-grey-600"
        />
        <button
          type="submit"
          disabled={busy || !email}
          className="inline-flex flex-none items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-black transition-opacity duration-fast hover:opacity-60 disabled:opacity-40"
        >
          {busy ? "Joining…" : "Join"}
          <ArrowRightLong width={18} height={18} />
        </button>
      </div>

      <label className="mt-3 flex items-start gap-2.5 text-small text-grey-700">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none accent-black"
        />
        I agree to receive research updates. Unsubscribe anytime.
      </label>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
    </form>
  );
}

/* ---- footer ----------------------------------------------------------- */

export default function Footer() {
  return (
    <footer className="bg-grad-powder">
      {/* Extra bottom padding keeps the legal row clear of the fixed chat
          launcher in the bottom-right corner. */}
      <div className="shell pb-24 pt-4 lg:pb-16">
        <TrendingCard />

        {/* ---- link groups ------------------------------------------- */}
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="eyebrow">{g.title}</h3>
              <ul className="mt-5 space-y-3">
                {g.links.map((l, i) => {
                  const Icon = g.icons ? GROUP_ICONS[i] : null;
                  return (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-3 text-base text-grey-700 transition-colors duration-fast hover:text-black"
                      >
                        {Icon && (
                          <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-grey-200 bg-white text-black">
                            <Icon width={16} height={16} />
                          </span>
                        )}
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- newsletter -------------------------------------------- */}
        <div className="mt-14 border-t border-grey-200 pt-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
            <div>
              <p className="eyebrow">Stay in touch</p>
              <p className="mt-2 text-h3 font-normal text-black">
                Batch drops and early access.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <NewsletterForm />
              <div className="hidden flex-none gap-2 sm:flex">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Peptiva Labs on Instagram"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-black text-white transition-opacity duration-fast hover:opacity-80"
                >
                  <InstagramIcon width={20} height={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Peptiva Labs on LinkedIn"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-black text-white transition-opacity duration-fast hover:opacity-80"
                >
                  <LinkedInIcon width={20} height={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---- bottom bar -------------------------------------------- */}
        <div className="mt-12 border-t border-grey-200 pt-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Logo />
              <p className="mt-4 text-base text-grey-700">
                Reference-grade research materials, verified.
              </p>
              <p className="mt-4 max-w-md text-small text-grey-600">
                © {new Date().getFullYear()} Peptiva Labs. All rights reserved.
                For laboratory research use only — not for human or veterinary
                use.
              </p>
            </div>

            <div className="lg:text-right">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className="chip">USD $</span>
                <span className="chip">English</span>
              </div>

              <p className="mt-5 text-small text-grey-700">
                Something else?{" "}
                <Link href="/contact" className="link-micro">
                  Contact us
                </Link>
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
                {[
                  { label: "Privacy policy", href: "/privacy-policy" },
                  { label: "Shipping and returns", href: "/shipping-policy" },
                  { label: "Refund policy", href: "/refund-policy" },
                  { label: "Terms of service", href: "/terms-of-service" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-small text-grey-700 transition-colors duration-fast hover:text-black"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
