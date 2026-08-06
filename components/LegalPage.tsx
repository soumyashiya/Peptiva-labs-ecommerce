"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/seo";
import { ChevronDownIcon } from "@/components/icons";

export type LegalSection = { id: string; label: string };

export function LegalShell({
  icon,
  eyebrow,
  title,
  updated,
  intro,
  sections,
  children,
}: {
  icon?: ReactNode;
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-20 pt-28 sm:pb-28 sm:pt-32">
        <div className="container-fluid">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{title}</span>
          </nav>

          {/* Hero */}
          <div className="mt-6 flex flex-col gap-5 rounded-card border border-line bg-white p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            {icon && (
              <div className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-nude-green text-ink">
                {icon}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center rounded-pill border border-line px-2.5 py-1 text-[10px] uppercase tracking-label text-ink-secondary">
                  {eyebrow}
                </span>
                <span className="inline-flex items-center rounded-pill bg-surface-soft px-2.5 py-1 text-[10px] text-ink-muted">
                  Last updated {updated}
                </span>
              </div>
              <h1 className="mt-3 text-[clamp(26px,3.6vw,40px)] font-medium leading-[1.1] tracking-tight2 text-ink">
                {title}
              </h1>
              <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-ink-secondary">
                {intro}
              </p>
            </div>
          </div>

          {/* Mobile: collapsible on-this-page nav */}
          <details className="mt-6 rounded-card border border-line bg-white p-4 md:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-medium text-ink">
              On this page
              <ChevronDownIcon className="text-ink-muted" />
            </summary>
            <ul className="mt-3 space-y-1 border-t border-line pt-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-1.5 text-[13px] text-ink-secondary transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <nav
              aria-label="Section navigation"
              className="hidden md:col-span-4 md:block lg:col-span-3"
            >
              <div className="sticky top-28 rounded-card border border-line bg-white p-5">
                <p className="text-[11px] uppercase tracking-label text-ink-muted">
                  On this page
                </p>
                <ul className="mt-3 space-y-0.5">
                  {sections.map((s) => {
                    const isActive = s.id === active;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          aria-current={isActive}
                          className={`block rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                            isActive
                              ? "bg-canvas font-medium text-ink"
                              : "text-ink-secondary hover:text-ink"
                          }`}
                        >
                          {s.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-5 rounded-card border border-line bg-white p-5">
                <p className="text-[13px] font-medium text-ink">
                  Still have questions?
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-secondary">
                  Reach our team any time at
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-1.5 inline-block text-[13px] font-medium text-ink underline-offset-4 hover:underline"
                >
                  {CONTACT.email}
                </a>
              </div>
            </nav>

            <div className="md:col-span-8 lg:col-span-9">
              <div
                ref={scopeRef}
                className="legal-sections legal-prose max-w-3xl space-y-5 text-[14px] leading-relaxed text-ink-secondary"
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="legal-section scroll-mt-28 rounded-card border border-line bg-white p-6 sm:p-7"
    >
      <div className="flex items-start gap-3.5">
        <span className="section-num mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink_btn text-[11px] font-semibold text-white" />
        <div className="min-w-0">
          <h2 className="text-[18px] font-medium tracking-tight2 text-ink">
            {title}
          </h2>
          <div className="mt-3 space-y-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
