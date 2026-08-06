"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ApiError,
  applyCapturePromo,
  uploadCaptureScreenshot,
  validateCaptureToken,
  type BankDetails,
  type OrderItemRow,
  type OrderRow,
  type PaymentRow,
  type PaymentVerification,
} from "@/lib/api";
import { formatUSD } from "@/lib/products";
import { LockIcon, ShieldIcon } from "@/components/icons";

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

const REASON_LABELS: Record<string, string> = {
  amount_match: "Amount matches",
  amount_mismatch: "Amount doesn't match",
  payee_match: "Payee name matches",
  payee_missing_or_mismatch: "Payee name not found",
  sort_code_match: "Sort code matches",
  sort_code_not_found: "Sort code not found",
  account_number_match: "Account number matches",
  account_number_not_found: "Account number not found",
  status_success_keyword: "Success confirmation detected",
  ocr_confidence_ok: "Image quality good",
  bank_signals_missing: "Bank details not detected",
};

function reasonLabel(reason: string): string {
  if (REASON_LABELS[reason]) return REASON_LABELS[reason];
  return reason
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function isPositiveReason(reason: string): boolean {
  return !/mismatch|not_found|missing/.test(reason);
}

type Ctx = {
  order: OrderRow;
  items: OrderItemRow[];
  payments: PaymentRow[];
  allowPromo: boolean;
  bank: BankDetails;
};

export default function PaymentCapturePage({
  params,
}: {
  params: { token: string };
}) {
  const token = decodeURIComponent(params.token);

  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    percent: number;
    total: number;
  } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    status: "received" | "rejected" | "pending";
    screenshotUrl?: string;
    verification?: PaymentVerification | null;
    verification_error?: string;
  } | null>(null);

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pickFile(f: File | null) {
    setUploadError(null);
    setFile(f);
  }

  useEffect(() => {
    validateCaptureToken(token)
      .then((r) => {
        setCtx({
          order: r.order,
          items: r.items,
          payments: r.payments,
          allowPromo: r.allowPromo,
          bank: r.bank,
        });
      })
      .catch((e) => {
        setError(
          e instanceof ApiError
            ? e.status === 404 || e.status === 400
              ? "This payment link is invalid or has expired."
              : e.message
            : "Failed to load payment link"
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    setPromoError(null);
    try {
      const r = await applyCapturePromo(token, code);
      setPromoApplied({
        code: r.promoCode,
        percent: r.promoDiscountPercent,
        total: r.total,
      });
    } catch (e) {
      setPromoError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Failed to apply promo"
      );
    } finally {
      setPromoBusy(false);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const r = await uploadCaptureScreenshot(token, file);
      setResult({
        status: r.payment_status,
        screenshotUrl: r.screenshotUrl,
        verification: r.verification,
        verification_error: r.verification_error,
      });
    } catch (e) {
      setUploadError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-24 pt-28 sm:pt-32">
        <div className="container-fluid">
          <p className="text-[11px] uppercase tracking-label text-ink-muted">
            Payment upload
          </p>
          <h1 className="mt-2 text-[clamp(38px,6vw,72px)] font-medium leading-[1] tracking-tight2 text-ink">
            Complete your payment
          </h1>

          {!loading && !error && (
            <PaymentSteps active={result ? 2 : 1} />
          )}

          {loading && (
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7 space-y-6">
                <div className="animate-pulse rounded-card border border-line bg-white p-6 sm:p-8">
                  <div className="h-3 w-20 rounded-full bg-line" />
                  <div className="mt-3 h-5 w-48 rounded-full bg-line" />
                  <div className="mt-8 space-y-4">
                    <div className="h-4 w-full rounded-full bg-line/70" />
                    <div className="h-4 w-5/6 rounded-full bg-line/70" />
                    <div className="h-4 w-2/3 rounded-full bg-line/70" />
                  </div>
                </div>
                <div className="animate-pulse rounded-card border border-line bg-white p-6 sm:p-8">
                  <div className="h-3 w-32 rounded-full bg-line" />
                  <div className="mt-6 h-32 rounded-card bg-line/60" />
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="animate-pulse rounded-card bg-surface-dim p-6 sm:p-8">
                  <div className="h-3 w-24 rounded-full bg-white/60" />
                  <div className="mt-6 space-y-4">
                    <div className="h-4 w-full rounded-full bg-white/50" />
                    <div className="h-4 w-full rounded-full bg-white/50" />
                    <div className="h-4 w-full rounded-full bg-white/50" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-10 max-w-xl rounded-card border border-line bg-white p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <p className="mt-4 text-[15px] font-medium text-ink">Link invalid</p>
              <p className="mt-2 text-[14px] text-ink-secondary">{error}</p>
              <Link href="/" className="btn-dark mt-6">
                Back to home
              </Link>
            </div>
          )}

          {ctx && !result && (
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left: order + bank + upload */}
              <div className="lg:col-span-7">
                {/* Order summary */}
                <section className="rounded-card border border-line bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-label text-ink-muted">
                        Order
                      </p>
                      <p className="mt-1 text-[18px] font-medium text-ink">
                        {ctx.order.order_number}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-pill border border-line bg-canvas px-3 py-1 text-[11px] uppercase tracking-label text-ink-secondary">
                      Payment: {ctx.order.payment_status || "pending"}
                    </span>
                  </div>

                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {ctx.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between py-3">
                        <div className="min-w-0 pr-4">
                          <p className="truncate text-[14px] font-medium text-ink">
                            {it.name}
                          </p>
                          <p className="text-[12px] text-ink-muted">
                            Qty {it.quantity} · {formatUSD(toNumber(it.unit_price))} each
                          </p>
                        </div>
                        <span className="text-[14px] font-medium text-ink">
                          {formatUSD(toNumber(it.line_total))}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between text-[14px] text-ink-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-ink">
                      {formatUSD(toNumber(ctx.order.subtotal))}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[14px] text-ink-secondary">
                    <span>Shipping</span>
                    <span className="font-medium text-ink">
                      {formatUSD(toNumber(ctx.order.shipping))}
                    </span>
                  </div>
                  {(promoApplied || toNumber(ctx.order.discount_amount) > 0) && (
                    <div className="mt-2 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Discount{promoApplied ? ` (${promoApplied.code})` : ""}</span>
                      <span className="font-medium text-ink">
                        −{formatUSD(toNumber(ctx.order.discount_amount))}
                      </span>
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-[16px] font-medium text-ink">
                      Total due
                    </span>
                    <span className="text-[22px] font-medium text-ink">
                      {formatUSD(promoApplied?.total ?? toNumber(ctx.order.total))}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3 rounded-2xl border border-line bg-canvas p-4 text-[11px] leading-relaxed text-ink-secondary">
                    <ShieldIcon className="mt-0.5 h-4 w-4 flex-none text-ink-muted" />
                    <div>
                      <p className="font-semibold uppercase tracking-label text-ink">
                        Research use only
                      </p>
                      <p className="mt-1.5">
                        By completing this payment, you acknowledge that these
                        products are supplied solely for laboratory research and
                        are not intended for human or veterinary use. These
                        products are not intended to diagnose, treat, cure, or
                        prevent any disease.
                      </p>
                    </div>
                  </div>

                  {/* Promo (only if allowed) */}
                  {ctx.allowPromo && !promoApplied && (
                    <div className="mt-6 border-t border-line pt-5">
                      <p className="text-[12px] font-medium text-ink">
                        Have a promo code?
                      </p>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="min-w-0 flex-1 rounded-pill border border-line bg-white px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink/30"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoBusy || !promoInput.trim()}
                          className="rounded-pill border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-ink hover:bg-canvas disabled:opacity-50"
                        >
                          {promoBusy ? "…" : "Apply"}
                        </button>
                      </div>
                      {promoError && (
                        <p className="mt-2 text-[12px] text-red-600">{promoError}</p>
                      )}
                    </div>
                  )}
                  {promoApplied && (
                    <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
                      {promoApplied.code} · {promoApplied.percent}% off applied. New
                      total {formatUSD(promoApplied.total)}.
                    </p>
                  )}
                </section>

                {/* Upload */}
                <section className="mt-8 rounded-card border border-line bg-white p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-label text-ink-muted">
                    Upload proof of payment
                  </p>
                  <h2 className="mt-2 text-[20px] font-medium tracking-tight2 text-ink">
                    Attach your bank-transfer screenshot
                  </h2>
                  <p className="mt-2 text-[13px] text-ink-secondary">
                    We&rsquo;ll verify it and mark your order as paid. Accepted
                    formats: any image. Max 25 MB.
                  </p>

                  <label
                    htmlFor="screenshot"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) pickFile(f);
                    }}
                    className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-card border border-dashed p-8 text-center transition-all duration-200 ${
                      dragActive
                        ? "border-ink/50 bg-ink/[0.04] scale-[1.01]"
                        : "border-line bg-canvas hover:border-ink/40"
                    }`}
                  >
                    {filePreview ? (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={filePreview}
                          alt="Screenshot preview"
                          className="mx-auto max-h-40 rounded-2xl border border-line object-contain shadow-soft"
                        />
                      </div>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 15V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <p className="mt-3 text-[14px] font-medium text-ink">
                      {file ? file.name : "Choose image or drag it here"}
                    </p>
                    <p className="mt-1 text-[12px] text-ink-muted">
                      {file ? `${(file.size / 1024).toFixed(0)} KB · tap to replace` : "PNG, JPG up to 25 MB"}
                    </p>
                    <input
                      ref={fileRef}
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  {file && !uploading && (
                    <button
                      type="button"
                      onClick={() => {
                        pickFile(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="mt-3 text-[12px] font-medium text-ink-muted underline underline-offset-2 hover:text-ink"
                    >
                      Remove file
                    </button>
                  )}

                  {uploadError && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                      {uploadError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="btn-dark relative mt-5 w-full justify-center overflow-hidden disabled:opacity-60"
                  >
                    {uploading && (
                      <span className="absolute inset-y-0 left-0 w-full animate-[upload-progress_1.4s_ease-in-out_infinite] bg-white/15" />
                    )}
                    <span className="relative inline-flex items-center gap-2">
                      {uploading && (
                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      )}
                      {uploading ? "Verifying screenshot…" : "Submit for verification"}
                    </span>
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
                    <LockIcon className="h-3.5 w-3.5" />
                    Verified automatically via secure OCR matching
                  </p>
                </section>
              </div>

              {/* Right: bank details */}
              <aside className="lg:col-span-5">
                <div className="rounded-card bg-surface-dim p-6 sm:p-8 lg:sticky lg:top-28">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink-secondary">
                      <LockIcon className="h-4 w-4" />
                    </span>
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Transfer to
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 text-[14px]">
                    <BankRow label="Payee" value={ctx.bank.payeeName} />
                    <BankRow label="Sort code" value={ctx.bank.sortCode} mono />
                    <BankRow
                      label="Account number"
                      value={ctx.bank.accountNumber}
                      mono
                    />
                    <BankRow label="Reference" value={ctx.bank.reference} mono />
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    <span className="text-[14px] text-ink-secondary">
                      Amount to send
                    </span>
                    <span className="text-[20px] font-medium text-ink">
                      {formatUSD(promoApplied?.total ?? toNumber(ctx.order.total))}
                    </span>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-ink-muted">
                    Use the reference above so we can match your transfer. After
                    sending, upload the confirmation screenshot on the left.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {result && (
            <ResultCard
              status={result.status}
              screenshotUrl={result.screenshotUrl}
              verification={result.verification}
              verification_error={result.verification_error}
              orderNumber={ctx?.order.order_number}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function BankRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/40 px-3.5 py-2.5 transition-colors hover:bg-white/70">
      <span className="text-ink-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={`font-medium text-ink ${mono ? "font-mono" : ""}`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-ink-secondary transition-colors hover:bg-white hover:text-ink"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            "Copy"
          )}
        </button>
      </div>
    </div>
  );
}

function PaymentSteps({ active }: { active: 0 | 1 | 2 }) {
  const steps = ["Review order", "Send transfer & upload proof", "Verification"];
  return (
    <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((label, i) => {
        const state = i < active ? "done" : i === active ? "active" : "upcoming";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-medium transition-colors ${
                state === "done"
                  ? "bg-ink_btn text-white"
                  : state === "active"
                    ? "border border-ink_btn text-ink"
                    : "border border-line text-ink-muted"
              }`}
            >
              {state === "done" ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`text-[12px] font-medium ${
                state === "upcoming" ? "text-ink-muted" : "text-ink"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="ml-2 hidden h-px w-8 bg-line sm:inline-block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ResultCard({
  status,
  screenshotUrl,
  verification,
  verification_error,
  orderNumber,
}: {
  status: "received" | "rejected" | "pending";
  screenshotUrl?: string;
  verification?: PaymentVerification | null;
  verification_error?: string;
  orderNumber?: string;
}) {
  const config = {
    received: {
      title: "Payment received",
      body: "Your transfer was verified. We&rsquo;ll process your order shortly.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    rejected: {
      title: "Payment couldn't be verified",
      body: "The screenshot didn&rsquo;t match the expected transfer. Please double-check the amount and reference, then try again.",
      color: "bg-red-50 border-red-200 text-red-700",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-red-100 text-red-600",
    },
    pending: {
      title: "Awaiting manual review",
      body: "Automatic verification isn&rsquo;t available right now. Our team will review your screenshot shortly.",
      color: "bg-surface-soft border-line text-ink-secondary",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-surface-mute text-ink-secondary",
    },
  }[status];

  const probabilityPct = verification
    ? Math.round(verification.probability * 100)
    : null;

  return (
    <div className="mt-10 max-w-xl">
      <div className={`rounded-card border p-6 sm:p-8 ${config.color}`}>
        <div className="flex items-start gap-4">
          <span
            className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-full ${config.iconBg}`}
          >
            {config.icon}
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-label opacity-70">
              Verification result
            </p>
            <h2 className="mt-1 text-[22px] font-medium tracking-tight2 text-ink">
              {config.title}
            </h2>
          </div>
        </div>
        <p
          className="mt-4 text-[14px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: config.body }}
        />
        {verification_error && (
          <p className="mt-3 text-[12px] opacity-80">
            Details: {verification_error}
          </p>
        )}

        {verification && (
          <div className="mt-5 rounded-2xl border border-current/15 bg-white/60 p-4">
            <div className="flex items-center justify-between text-[12px] font-medium">
              <span className="opacity-80">Match confidence</span>
              <span>{probabilityPct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-current/10">
              <div
                className="h-full rounded-full bg-current transition-all duration-700"
                style={{ width: `${probabilityPct}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-[12px]">
              <span className="opacity-70">Amount detected</span>
              <span className="font-medium">
                {verification.extracted.best_amount != null
                  ? formatUSD(verification.extracted.best_amount)
                  : "Not found"}{" "}
                <span className="opacity-60">
                  / expected {formatUSD(verification.extracted.expected_total)}
                </span>
              </span>
            </div>

            {verification.reasons.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {verification.reasons.map((r) => (
                  <li
                    key={r}
                    className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-medium ${
                      isPositiveReason(r)
                        ? "border-emerald-300/60 bg-emerald-500/10 text-emerald-800"
                        : "border-red-300/60 bg-red-500/10 text-red-700"
                    }`}
                  >
                    {isPositiveReason(r) ? "✓" : "✕"} {reasonLabel(r)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {screenshotUrl && (
          <a
            href={screenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-[12px] underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            View uploaded screenshot ↗
          </a>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={
            orderNumber
              ? `/orders/${encodeURIComponent(orderNumber)}`
              : "/track-order"
          }
          className="btn-dark"
        >
          Track order
        </Link>
        <Link href="/" className="btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
