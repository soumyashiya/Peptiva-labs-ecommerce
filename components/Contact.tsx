"use client";

import { useState } from "react";
import Link from "next/link";
import { useReveal } from "./useReveal";
import { useToast } from "@/components/Toast";
import { MailIcon, ClockIcon, DocIcon, ArrowUpRight } from "./icons";

const INFO = [
  {
    Icon: MailIcon,
    title: "Email",
    body: "sales@peptivalabs.com",
    href: "mailto:sales@peptivalabs.com",
  },
  {
    Icon: ClockIcon,
    title: "Response time",
    body: "Within 1 business day, Mon–Fri",
  },
  {
    Icon: DocIcon,
    title: "Already ordered?",
    body: "Track an existing shipment",
    href: "/track-order",
  },
];

export default function Contact() {
  const scope = useReveal<HTMLDivElement>();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || website) return;
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setBusy(true);
    const subject = `Website enquiry from ${name.trim()}`;
    const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
    const mailto = `mailto:sales@peptivalabs.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    toast.success(
      "Your email app should open with the message ready to send.",
      "Almost there"
    );
    setBusy(false);
  }

  return (
    <section id="contact" className="section-block py-16 sm:py-20 md:py-28">
      <div ref={scope} className="container-fluid">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — copy + info */}
          <div data-reveal className="reveal-init">
            <span className="text-[12px] font-medium uppercase tracking-label text-ink-secondary">
              Get in touch
            </span>
            <h2 className="mt-3 text-h2 font-normal text-balance text-ink">
              Questions about a batch, an order, or sourcing? Talk to us.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-secondary">
              A real person reads every message — no ticket queue, no bots.
              Reach out about lab reports, bulk research orders, or anything
              else and we&rsquo;ll get back to you fast.
            </p>

            <ul className="mt-10 space-y-4">
              {INFO.map(({ Icon, title, body, href }) => {
                const content = (
                  <>
                    <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl border border-line bg-white text-ink">
                      <Icon width={18} height={18} />
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-ink">
                        {title}
                      </span>
                      <span className="block text-[13px] text-ink-secondary">
                        {body}
                      </span>
                    </span>
                  </>
                );
                const rowClass =
                  "flex items-center gap-4 rounded-card border border-line bg-white p-4 transition-colors";

                if (!href) {
                  return (
                    <li key={title} className={rowClass}>
                      {content}
                    </li>
                  );
                }
                const isExternal = href.startsWith("mailto:");
                return (
                  <li key={title}>
                    {isExternal ? (
                      <a href={href} className={`${rowClass} hover:border-ink/20`}>
                        {content}
                      </a>
                    ) : (
                      <Link href={href} className={`${rowClass} hover:border-ink/20`}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right — form */}
          <div
            data-reveal
            className="reveal-init rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
          >
            <h3 className="text-[18px] font-medium text-ink">Send a message</h3>
            <p className="mt-1.5 text-[13px] text-ink-secondary">
              Fill this in and your email app will open with everything
              pre-filled — just hit send.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-[12px] font-medium text-ink-secondary"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-pill border border-line bg-canvas px-4 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-muted focus:border-ink/30"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-[12px] font-medium text-ink-secondary"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@lab.com"
                  className="w-full rounded-pill border border-line bg-canvas px-4 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-muted focus:border-ink/30"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-[12px] font-medium text-ink-secondary"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-[20px] border border-line bg-canvas px-4 py-3 text-[13px] text-ink outline-none placeholder:text-ink-muted focus:border-ink/30"
                />
              </div>

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

              <button
                type="submit"
                disabled={busy}
                className="btn-dark inline-flex w-full items-center justify-center gap-2 disabled:opacity-50"
              >
                Send message
                <ArrowUpRight width={16} height={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
