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
      <main className="bg-white pb-20 pt-28 sm:pb-28 sm:pt-32">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="text-small text-grey-600">
            <Link href="/" className="transition-colors hover:text-black">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">{title}</span>
          </nav>

          {/* Hero */}
          <div className="mt-6 flex flex-col gap-5 rounded-lg border border-grey-200 bg-white p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            {icon && (
              <div className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-tint-sage text-black">
                {icon}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center rounded-pill border border-grey-200 px-2.5 py-1 text-small uppercase tracking-caps text-grey-700">
                  {eyebrow}
                </span>
                <span className="inline-flex items-center rounded-pill bg-sand-100 px-2.5 py-1 text-small text-grey-600">
                  Last updated {updated}
                </span>
              </div>
              <h1 className="mt-3 text-h2 font-normal leading-[1.1] text-black">
                {title}
              </h1>
              <p className="mt-2.5 max-w-2xl text-base leading-relaxed text-grey-700">
                {intro}
              </p>
            </div>
          </div>

          {/* Mobile: collapsible on-this-page nav */}
          <details className="mt-6 rounded-lg border border-grey-200 bg-white p-4 md:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-small font-medium text-black">
              On this page
              <ChevronDownIcon className="text-grey-600" />
            </summary>
            <ul className="mt-3 space-y-1 border-t border-grey-200 pt-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-1.5 text-small text-grey-700 transition-colors hover:text-black"
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
              <div className="sticky top-28 rounded-lg border border-grey-200 bg-white p-5">
                <p className="text-small uppercase tracking-caps text-grey-600">
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
                          className={`block rounded-lg px-2.5 py-1.5 text-small transition-colors ${
                            isActive
                              ? "bg-white font-medium text-black"
                              : "text-grey-700 hover:text-black"
                          }`}
                        >
                          {s.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-5 rounded-lg border border-grey-200 bg-white p-5">
                <p className="text-small font-medium text-black">
                  Still have questions?
                </p>
                <p className="mt-1.5 text-small leading-relaxed text-grey-700">
                  Reach our team any time at
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-1.5 inline-block text-small font-medium text-black underline-offset-4 hover:underline"
                >
                  {CONTACT.email}
                </a>
              </div>
            </nav>

            <div className="md:col-span-8 lg:col-span-9">
              <div
                ref={scopeRef}
                className="legal-sections legal-prose max-w-3xl space-y-5 text-base leading-relaxed text-grey-700"
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
      className="legal-section scroll-mt-28 rounded-lg border border-grey-200 bg-white p-6 sm:p-7"
    >
      <div className="flex items-start gap-3.5">
        <span className="section-num mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black text-small font-semibold text-white" />
        <div className="min-w-0">
          <h2 className="text-h4 font-medium text-black">
            {title}
          </h2>
          <div className="mt-3 space-y-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
