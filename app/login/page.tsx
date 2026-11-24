"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";
import { friendlyLoginError } from "@/lib/errors";
import AuthShell, { Eyebrow, INPUT } from "@/components/AuthShell";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";
  const { login, loading } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success(
        `Welcome back${user.name ? `, ${user.name.split(" ")[0]}` : ""}.`,
        "Signed in"
      );
      router.push(next);
    } catch (err) {
      if (typeof console !== "undefined") console.error("login failed:", err);
      toast.error(friendlyLoginError(err), "Sign-in failed");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <Eyebrow>Welcome back</Eyebrow>
      <h1 className="mt-4 text-[28px] font-medium leading-tight text-black sm:text-[34px]">Sign in to Peptiva Labs</h1>
      <p className="mt-2 text-base text-grey-700">
        Access your orders, wallet balance and affiliate dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-small font-medium text-black">Email</span>
          <input
            type="email"
            required
            placeholder="you@lab.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
          />
        </label>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-small font-medium text-black">
              Password
            </label>
            <Link href="/forgot-password" className="text-small text-grey-700 underline-offset-4 hover:text-black hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className={`${INPUT} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-pressed={showPw}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-small font-medium text-grey-700 transition-colors hover:text-black"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-1 w-full justify-center">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-micro uppercase text-grey-600">
        <span className="h-px flex-1 bg-grey-200" />
        New here?
        <span className="h-px flex-1 bg-grey-200" />
      </div>

      <Link
        href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
        className="btn-secondary mt-6 w-full justify-center"
      >
        Create an account
      </Link>

      <p className="mt-6 flex items-center justify-center gap-2 text-small text-grey-600">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
          <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 6V4a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Encrypted end-to-end. Sessions expire after 30 days.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      img="/new-images/auth/signin-hd.webp"
      tag="Members"
      title="Your orders, wallet and lab reports in one place."
      points={["Janoshik-tested", "Cold-chain shipping", "Wallet credit"]}
    >
      <Suspense fallback={<div className="text-grey-700">Loading…</div>}>
        <LoginInner />
      </Suspense>
    </AuthShell>
  );
}
