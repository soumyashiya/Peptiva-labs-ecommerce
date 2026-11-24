"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Logo,
  MenuIcon,
  CloseIcon,
  CartIcon,
  SearchIcon,
  UserIcon,
  StarIcon,
  ChevronRightIcon,
  ArrowRightLong,
} from "./icons";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { PRODUCTS } from "@/lib/products";
import ShopMenu from "./ShopMenu";

const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Science", href: "/science" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ========================================================================
   Announcement bar
   Black full-bleed strip above the header. Three static slots on desktop;
   on mobile the same three rotate in place, which is how the reference
   handles the narrow breakpoint.
   ======================================================================== */

const ANNOUNCEMENTS = [
  { kind: "link" as const, label: "Third-party tested — view reports", href: "/#why" },
  { kind: "rating" as const },
  { kind: "text" as const, label: "Cold-chain shipping on every order" },
];

function AnnouncementItem({ item }: { item: (typeof ANNOUNCEMENTS)[number] }) {
  if (item.kind === "rating") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="flex items-center gap-[1px] text-white">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} size={15} fill={4.8 - i} />
          ))}
        </span>
        <span className="font-medium">4.8</span>
        <span className="text-white/80">rating</span>
      </span>
    );
  }
  if (item.kind === "link") {
    return (
      <Link href={item.href} className="inline-flex items-center gap-1.5 underline underline-offset-4">
        {item.label}
        <span aria-hidden>→</span>
      </Link>
    );
  }
  return <span>{item.label}</span>;
}

function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  // Only the mobile layout rotates; the interval is harmless on desktop where
  // all three are rendered side by side.
  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      4200
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-black text-white">
      <div className="mx-auto flex h-9 max-w-shell items-center justify-center px-4 text-small">
        {/* desktop: all three, evenly spread with hairline dividers */}
        <div className="hidden w-full items-center justify-between lg:flex">
          {ANNOUNCEMENTS.map((item, i) => (
            <div key={i} className="flex flex-1 items-center justify-center first:justify-start last:justify-end">
              <AnnouncementItem item={item} />
            </div>
          ))}
        </div>

        {/* mobile: one at a time, cross-faded */}
        <div className="relative flex h-9 w-full items-center justify-center overflow-hidden lg:hidden">
          {ANNOUNCEMENTS.map((item, i) => (
            <span
              key={i}
              aria-hidden={i !== index}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[13px] transition-opacity duration-fast ease-standard"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <AnnouncementItem item={item} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   Header icon cluster
   ======================================================================== */

function IconButton({
  children,
  label,
  href,
  onClick,
  badge,
  text,
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: number;
  /** Visible word beside the icon on wide screens, as the reference does. */
  text?: string;
}) {
  const cls = `relative inline-flex h-10 items-center justify-center rounded-full text-black transition-colors duration-fast ease-standard hover:bg-grey-100 ${
    text ? "w-10 xl:w-auto xl:gap-2 xl:px-2.5 xl:hover:bg-transparent xl:hover:opacity-60" : "w-10"
  }`;
  const inner = (
    <>
      {children}
      {text && <span className="hidden text-[17px] font-medium xl:inline">{text}</span>}
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-0 top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium leading-none text-white">
          {badge}
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} aria-label={label} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

function AccountControl({ onNavigate }: { onNavigate?: () => void }) {
  const { user, hydrated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reserve the slot before hydration so the icon row never shifts.
  if (!hydrated) return <div className="h-10 w-10 xl:w-[112px]" aria-hidden />;

  if (!user) {
    return (
      <IconButton label="Sign in" href="/login" onClick={onNavigate} text="Account">
        <UserIcon width={21} height={21} />
      </IconButton>
    );
  }

  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Account menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-small font-medium text-white transition-opacity duration-fast hover:opacity-85"
      >
        {initial}
      </button>
      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-[calc(100%+12px)] w-60 overflow-hidden rounded-lg border border-grey-200 bg-white shadow-soft"
        >
          <div className="border-b border-grey-200 px-4 py-3">
            <p className="text-small font-medium text-black">{user.name}</p>
            <p className="mt-0.5 truncate text-small text-grey-600">{user.email}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-small text-black transition-colors hover:bg-grey-100"
          >
            My account
          </Link>
          <Link
            href="/track-order"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-small text-black transition-colors hover:bg-grey-100"
          >
            Track my order
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="block w-full border-t border-grey-200 px-4 py-3 text-left text-small text-grey-700 transition-colors hover:bg-grey-100 hover:text-black"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function CartControl({ onNavigate }: { onNavigate?: () => void }) {
  const { count, hydrated } = useCart();
  return (
    <IconButton
      label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      href="/cart"
      onClick={onNavigate}
      badge={hydrated ? count : 0}
      text="Cart"
    >
      <CartIcon width={21} height={21} />
    </IconButton>
  );
}

/* ========================================================================
   Search overlay
   ======================================================================== */

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const term = q.trim().toLowerCase();
  const results = term
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.meta.toLowerCase().includes(term)
      )
    : PRODUCTS.slice(0, 4);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-fast ease-standard ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-black/55"
      />
      <div className="relative mx-auto mt-[12vh] w-[min(640px,92vw)] overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-grey-200 px-5">
          <SearchIcon width={20} height={20} className="flex-none text-grey-600" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="h-16 flex-1 bg-transparent text-base text-black outline-none placeholder:text-grey-600"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-grey-700 transition-colors hover:bg-grey-100"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-small text-grey-600">
              No products match “{q}”.
            </p>
          ) : (
            results.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 rounded-md px-3 py-3 transition-colors hover:bg-grey-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt=""
                  className="h-12 w-12 flex-none rounded-md bg-sand-100 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base text-black">{p.name}</span>
                  <span className="block truncate text-small text-grey-600">{p.meta}</span>
                </span>
                <ChevronRightIcon className="flex-none text-grey-600" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   Navbar
   ======================================================================== */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopTimer = useRef<number | null>(null);
  const openShop = () => {
    if (shopTimer.current) window.clearTimeout(shopTimer.current);
    setShopOpen(true);
  };
  // A short grace period so moving the pointer from the link down into
  // the panel does not close it.
  const closeShop = () => {
    if (shopTimer.current) window.clearTimeout(shopTimer.current);
    shopTimer.current = window.setTimeout(() => setShopOpen(false), 140);
  };
  const { user } = useAuth();

  // Lock the page behind the mobile drawer and the search overlay.
  useEffect(() => {
    const locked = menuOpen || searchOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // The pill only grows a shadow once it detaches from the top of the page.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />

      {/* Geometry matches the reference exactly. At rest the pill sits 52px
          below the announcement bar (so the hero's rounded top edge shows
          through the gap); once scrolled it pins 16px below the bar. The
          negative margin cancels the header's full in-flow height — margin
          plus pill — so the hero still starts flush under the bar and runs
          underneath the pill. */}
      <header className="sticky top-[44px] z-40 mt-5 -mb-[76px] lg:top-[48px] lg:mt-[48px] lg:-mb-[108px]">
        {/* Pill runs the full hero width, inset 24px inside its rounded edge
            (hero inset 52px + 24px = 76px on desktop). */}
        <div className="px-3 lg:px-[76px]">
          <div
            className={`relative mx-auto flex h-14 items-center justify-between rounded-pill bg-white px-4 transition-shadow duration-fast ease-standard lg:h-[60px] lg:px-12 ${
              scrolled ? "shadow-nav" : "shadow-tile"
            }`}
          >
            <Link href="/" aria-label="Peptiva Labs home" className="flex-none">
              <Logo />
            </Link>

            {/* In normal flow rather than absolutely centred: with the icon
                cluster carrying visible labels, absolute centring lets the
                links slide underneath it at narrower desktop widths. */}
            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
              {NAV_LINKS.map((l) =>
                l.label === "Shop" ? (
                  <div
                    key={l.label}
                    onMouseEnter={openShop}
                    onMouseLeave={closeShop}
                    onFocus={openShop}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) closeShop();
                    }}
                    onKeyDown={(e) => e.key === "Escape" && setShopOpen(false)}
                  >
                    <Link
                      href={l.href}
                      aria-haspopup="true"
                      aria-expanded={shopOpen}
                      className={`whitespace-nowrap text-base transition-opacity duration-fast hover:opacity-60 ${shopOpen ? "text-black/50" : "text-black"}`}
                    >
                      {l.label}
                    </Link>
                    {shopOpen && (
                      <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                        <ShopMenu onNavigate={() => setShopOpen(false)} />
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="whitespace-nowrap text-base text-black transition-opacity duration-fast hover:opacity-60"
                  >
                    {l.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex flex-none items-center gap-0.5 sm:gap-1 xl:gap-3">
              <CartControl />
              <IconButton label="Search" onClick={() => setSearchOpen(true)} text="Search">
                <SearchIcon width={21} height={21} />
              </IconButton>
              <div className="hidden sm:block">
                <AccountControl />
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-grey-100 lg:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon width={22} height={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer — rendered outside the sticky header so `fixed` anchors
          to the viewport and the backdrop stays fully opaque. */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-white transition-opacity duration-fast ease-standard lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-16 flex-none items-center justify-between border-b border-grey-200 px-4">
          <Link href="/" aria-label="Peptiva Labs home" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-grey-100"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon width={22} height={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4">
          <nav className="flex flex-col pt-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-grey-200 py-4 text-h4 text-black"
              >
                {l.label}
                <ChevronRightIcon className="text-grey-600" />
              </Link>
            ))}
          </nav>

          <p className="eyebrow mt-8">Your account</p>
          <div className="mt-2 flex flex-col">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-grey-200 py-3.5 text-base text-black"
                >
                  My account
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-grey-200 py-3.5 text-base text-black"
                >
                  Track my order
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-grey-200 py-3.5 text-base text-black"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-grey-200 py-3.5 text-base text-black"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="btn-primary btn-block mb-8 mt-auto"
          >
            Shop all
            <ArrowRightLong width={18} height={18} />
          </Link>
        </div>
      </div>
    </>
  );
}
