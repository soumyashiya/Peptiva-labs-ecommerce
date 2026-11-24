"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { ArrowLeft } from "@/components/icons";
import { getProduct, formatUSD, type Product } from "@/lib/products";
import { ApiError, createUserOrder, getOrder, validatePromo } from "@/lib/api";
import { useToast } from "@/components/Toast";

const SHIPPING_FEE = 45;

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

// Fires the shared-email order confirmation using the order the backend
// persisted (fetched fresh via getOrder) rather than the checkout form state,
// so the email always reflects what was actually saved. Best-effort — a
// failure here must never surface as a checkout error.
async function sendOrderConfirmation(orderNumber: string) {
  const { order, items } = await getOrder(orderNumber);
  await fetch("/api/send-order-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: {
        name: order.customer_name || "",
        email: order.customer_email,
      },
      order: {
        orderNumber: order.order_number,
        currency: order.currency || "USD",
        items: items.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: toNumber(it.unit_price),
        })),
        subtotal: toNumber(order.subtotal),
        shipping: toNumber(order.shipping),
        tax: 0,
        discount: toNumber(order.discount_amount),
        total: toNumber(order.total),
        shippingAddress: [
          order.shipping_address,
          order.shipping_city,
          order.shipping_state,
          order.shipping_zip,
          order.shipping_country,
        ]
          .filter(Boolean)
          .join(", "),
      },
    }),
  });
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  line1: "",
  line2: "",
  city: "",
  postcode: "",
  country: "",
};

// Translate raw backend errors into copy a shopper can act on. The technical
// detail is still logged to the console for debugging.
function friendlyOrderError(e: unknown): string {
  if (e instanceof ApiError) {
    const raw = (e.message || "").toLowerCase();

    // Blacklist / anti-fraud rejection (documented as 403)
    if (e.status === 403) {
      return "We couldn't process this order. Please contact support if you think this is a mistake.";
    }

    // The service throws a generic 500 for a missing/invalid email — surface
    // it as a form-level hint instead of a server error.
    if (raw.includes("missing") && raw.includes("email")) {
      return "Please double-check your email address and try again.";
    }
    if (raw.includes("invalid") && raw.includes("email")) {
      return "That email address doesn't look right. Please check and try again.";
    }

    if (e.status === 429) {
      return "Too many attempts in a short time. Please wait a moment and try again.";
    }

    // 502 / 503 / 504 — upstream is briefly unreachable
    if (e.status === 502 || e.status === 503 || e.status === 504) {
      return "Our checkout is briefly unavailable. Please try again in a minute.";
    }

    // Any other 5xx — generic server hiccup
    if (e.status >= 500) {
      return "Something went wrong on our side while placing your order. Please try again in a moment.";
    }

    // 400-range — surface a soft, action-oriented message.
    if (e.status >= 400) {
      return "We couldn't complete your order. Please review your details and try again.";
    }

    // status 0 → network / timeout / offline
    return "We couldn't reach the checkout server. Check your connection and try again.";
  }

  return "We couldn't place your order right now. Please try again in a moment.";
}

export default function CheckoutPage() {
  const { items, hydrated, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(
    null
  );
  const [promoBusy, setPromoBusy] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [placedTotal, setPlacedTotal] = useState(0);
  const [placedEmail, setPlacedEmail] = useState("");

  // Prefill from logged-in user (only once).
  const [prefilled, setPrefilled] = useState(false);
  if (user && !prefilled) {
    setPrefilled(true);
    setForm((f) => {
      const parts = (user.name || "").trim().split(/\s+/);
      return {
        ...f,
        firstName: f.firstName || parts.slice(0, -1).join(" ") || parts[0] || "",
        lastName:
          f.lastName || (parts.length > 1 ? parts[parts.length - 1] : ""),
        email: f.email || user.email || "",
        mobile: f.mobile || user.phone || "",
        country: f.country || user.country_of_residence || "",
      };
    });
  }

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const lines = items
    .map((i) => {
      const product = getProduct(i.slug);
      return product ? { ...i, product } : null;
    })
    .filter((l): l is { slug: string; qty: number; product: Product } =>
      l !== null
    );

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = lines.length > 0 ? SHIPPING_FEE : 0;
  const discount = promo ? Math.round(subtotal * promo.percent) / 100 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  async function applyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    try {
      const r = await validatePromo(code);
      setPromo({ code: code.toUpperCase(), percent: r.percent });
      toast.success(
        `${code.toUpperCase()} applied — ${r.percent}% off your subtotal.`,
        "Promo applied"
      );
    } catch (e) {
      setPromo(null);
      const msg =
        e instanceof ApiError
          ? e.status === 404
            ? "That promo code isn't valid or has expired."
            : "We couldn't check that promo code right now. Please try again."
          : "We couldn't check that promo code right now. Please try again.";
      toast.error(msg, "Promo code");
    } finally {
      setPromoBusy(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
  }

  async function placeOrder() {
    // Guard against duplicate submissions — a re-entrant click while `placing`
    // is true would post twice.
    if (placing) return;

    setPlacing(true);
    try {
      const fullAddress = [form.line1, form.line2].filter(Boolean).join(", ");
      const r = await createUserOrder({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.mobile,
        address: fullAddress,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
        promoCode: promo?.code,
        promoDiscount: promo?.percent,
        subtotal,
        discountAmount: discount,
        total,
        createdAtIso: new Date().toISOString(),
        items: lines.map((l) => ({
          productId: l.product.slug,
          name: l.product.name,
          sku: l.product.slug,
          quantity: l.qty,
          unitPrice: l.product.price,
        })),
        paymentMethod: "manual",
      });
      setOrderRef(r.orderNumber);
      setPlacedTotal(total);
      setPlacedEmail(form.email);
      setPlaced(true);
      clear();
      // Warn engineers (and inform via toast) if the backend created the order
      // but silently skipped the confirmation email — this points at the
      // upstream email layer being disabled rather than a shopper-side issue.
      const emailAttempted = r.email_debug?.orderConfirmation?.attempted;
      if (emailAttempted === false && typeof console !== "undefined") {
        console.warn(
          "Order placed but backend did not attempt to send the confirmation email.",
          r.email_debug
        );
      }
      sendOrderConfirmation(r.orderNumber).catch((err) => {
        if (typeof console !== "undefined") {
          console.error("[checkout] order confirmation email failed:", err);
        }
      });
    } catch (e) {
      // Keep the raw error visible in the console for engineers, but show the
      // shopper an actionable message instead of an HTTP status.
      if (typeof console !== "undefined") console.error("placeOrder failed:", e);
      toast.error(friendlyOrderError(e), "Order not placed");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-white pb-20 pt-28 sm:pt-32">
        <div className="shell">
          {!hydrated ? (
            <p className="mt-6 text-base text-grey-700">Loading…</p>
          ) : lines.length === 0 && !placed ? (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-lg border border-grey-200 bg-white p-12 text-center">
              <h1 className="text-h2 font-normal text-black">
                Your cart is empty
              </h1>
              <p className="mt-3 text-base text-grey-700">
                Add a compound before proceeding to checkout.
              </p>
              <Link href="/products" className="btn-primary mt-7">
                Browse the catalogue
              </Link>
            </div>
          ) : (
            <>
              {/* Heading row */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-small text-grey-700 transition-colors hover:text-black"
                  >
                    <ArrowLeft /> Back to cart
                  </Link>
                  <span className="text-small uppercase tracking-caps text-grey-600">
                    Final step
                  </span>
                </div>
                <h1 className="mt-2 text-h1 font-normal text-black">
                  Checkout
                </h1>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Form column */}
                <form
                  className="lg:col-span-7"
                  onSubmit={(e) => {
                    e.preventDefault();
                    placeOrder();
                  }}
                >
                  {/* Contact */}
                  <section>
                    <p className="text-small uppercase tracking-caps text-grey-600">
                      Contact
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="First name"
                        placeholder="Jordan"
                        value={form.firstName}
                        onChange={(v) => update("firstName", v)}
                      />
                      <Field
                        label="Last name"
                        placeholder="Avery"
                        value={form.lastName}
                        onChange={(v) => update("lastName", v)}
                      />
                      <Field
                        label="Email address"
                        type="email"
                        placeholder="jordan@lab.com"
                        full
                        value={form.email}
                        onChange={(v) => update("email", v)}
                      />
                      <Field
                        label="Mobile"
                        type="tel"
                        placeholder="+971 54 …"
                        full
                        value={form.mobile}
                        onChange={(v) => update("mobile", v)}
                      />
                    </div>
                  </section>

                  {/* Shipping */}
                  <section className="mt-10">
                    <p className="text-small uppercase tracking-caps text-grey-600">
                      Shipping address
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Address line 1"
                        placeholder="123 Research Park"
                        full
                        value={form.line1}
                        onChange={(v) => update("line1", v)}
                      />
                      <Field
                        label={
                          <>
                            Address line 2{" "}
                            <span className="text-grey-600">(optional)</span>
                          </>
                        }
                        required={false}
                        placeholder="Unit 4B"
                        full
                        value={form.line2}
                        onChange={(v) => update("line2", v)}
                      />
                      <Field
                        label="City"
                        placeholder="City"
                        value={form.city}
                        onChange={(v) => update("city", v)}
                      />
                      <Field
                        label="Postcode"
                        placeholder="00000"
                        value={form.postcode}
                        onChange={(v) => update("postcode", v)}
                      />
                      <Field
                        label="Country"
                        placeholder="Country"
                        full
                        value={form.country}
                        onChange={(v) => update("country", v)}
                      />
                    </div>
                  </section>

                  {/* Mobile-only place order button */}
                  <button
                    type="submit"
                    disabled={placing}
                    className="btn-primary mt-8 w-full justify-center disabled:opacity-60 lg:hidden"
                  >
                    {placing ? "Placing order…" : `Place order · ${formatUSD(total)}`}
                  </button>
                </form>

                {/* Order summary */}
                <aside className="lg:col-span-5">
                  <div className="rounded-lg bg-sand-100 p-6 sm:p-8 lg:sticky lg:top-28">
                    <p className="text-small uppercase tracking-caps text-grey-600">
                      Order summary
                    </p>

                    <ul className="mt-6 space-y-4">
                      {lines.map((l) => (
                        <li key={l.slug} className="flex items-center gap-3">
                          <div className="relative flex-none">
                            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-grey-100">
                              <Image
                                src={l.product.img}
                                alt={l.product.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-small font-medium text-white ring-2 ring-sand-100">
                              {l.qty}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-medium text-black">
                              {l.product.name}
                            </p>
                            <p className="text-small text-grey-600">
                              {l.product.meta}
                            </p>
                          </div>
                          <span className="text-base font-medium text-black">
                            {formatUSD(l.product.price * l.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Promo code */}
                    <div className="mt-6 border-t border-grey-200 pt-6">
                      {promo ? (
                        <div className="flex items-center justify-between rounded-pill bg-white px-4 py-2.5">
                          <div>
                            <p className="text-small font-medium text-black">
                              {promo.code} · −{promo.percent}%
                            </p>
                            <p className="text-small text-grey-600">
                              Applied to subtotal
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removePromo}
                            className="text-small text-grey-700 underline-offset-4 hover:text-black hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Promo code"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              className="min-w-0 flex-1 rounded-pill border border-grey-200 bg-white px-4 py-2.5 text-small text-black outline-none transition-colors placeholder:text-grey-600 focus:border-black"
                            />
                            <button
                              type="button"
                              onClick={applyPromo}
                              disabled={promoBusy || !promoInput.trim()}
                              className="rounded-pill border border-grey-200 bg-white px-4 py-2.5 text-small font-medium text-black transition-colors hover:bg-white disabled:opacity-50"
                            >
                              {promoBusy ? "…" : "Apply"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between text-base text-grey-700">
                      <span>Subtotal</span>
                      <span className="font-medium text-black">
                        {formatUSD(subtotal)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-base text-grey-700">
                      <span>Shipping</span>
                      <span className="font-medium text-black">
                        {formatUSD(shipping)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="mt-3 flex items-center justify-between text-base text-grey-700">
                        <span>Discount ({promo?.code})</span>
                        <span className="font-medium text-black">
                          −{formatUSD(discount)}
                        </span>
                      </div>
                    )}
                    <div className="mt-5 flex items-center justify-between border-t border-grey-200 pt-5">
                      <span className="text-base font-medium text-black">
                        Total
                      </span>
                      <span className="text-h3 font-normal text-black">
                        {formatUSD(total)}
                      </span>
                    </div>

                    <div className="mt-6 rounded-2xl border border-grey-200 bg-white p-4 text-small leading-relaxed text-grey-700">
                      <p className="font-semibold uppercase tracking-caps text-black">
                        Research use only
                      </p>
                      <p className="mt-1.5">
                        By placing this order, you acknowledge that these
                        products are supplied solely for laboratory research and
                        are not intended for human or veterinary use. These
                        products are not intended to diagnose, treat, cure, or
                        prevent any disease.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={placeOrder}
                      disabled={placing}
                      className="btn-primary mt-4 hidden w-full justify-center disabled:opacity-60 lg:inline-flex"
                    >
                      {placing
                        ? "Placing order…"
                        : `Place order · ${formatUSD(total)}`}
                    </button>

                    <p className="mt-4 text-center text-small leading-relaxed text-grey-600">
                      Payment by bank transfer. We&rsquo;ll email you secure
                      payment instructions and a capture link for your receipt.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {placed && (
        <OrderPlacedModal
          orderRef={orderRef}
          total={placedTotal}
          email={placedEmail}
        />
      )}
    </>
  );
}

function OrderPlacedModal({
  orderRef,
  total,
  email,
}: {
  orderRef: string;
  total: number;
  email: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(orderRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order placed"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-lg bg-sand-100 p-8 text-center shadow-soft">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-5 text-[26px] font-medium text-black">
          Order confirmed
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-grey-700">
          Your order is recorded. A payment-instructions email will follow to{" "}
          <span className="font-medium text-black">{email}</span>. If it
          doesn&rsquo;t arrive within a few minutes, message us on WhatsApp with
          your reference and we&rsquo;ll send the bank details manually.
        </p>

        <div className="mt-6 rounded-xl bg-white px-4 py-3 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-small uppercase tracking-caps text-grey-600">
                Order reference
              </p>
              <p className="mt-0.5 truncate text-small font-medium text-black">
                {orderRef}
              </p>
            </div>
            <button
              type="button"
              onClick={copyRef}
              className="shrink-0 rounded-pill border border-grey-200 px-3 py-1.5 text-small font-medium text-grey-700 transition-colors hover:bg-white hover:text-black"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-grey-200 pt-3">
            <p className="text-small uppercase tracking-caps text-grey-600">
              Total
            </p>
            <p className="text-base font-medium text-black">
              {formatUSD(total)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="btn-primary justify-center sm:min-w-[180px]"
          >
            Continue shopping
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center rounded-pill border border-grey-200 bg-white px-5 py-2.5 text-base font-medium text-black transition-colors hover:bg-white sm:min-w-[140px]"
          >
            Track order
          </Link>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: React.ReactNode;
  placeholder?: string;
  type?: string;
  full?: boolean;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
};

function Field({
  label,
  placeholder,
  type = "text",
  full = false,
  required = true,
  value,
  onChange,
}: FieldProps) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-small font-medium text-black">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}
