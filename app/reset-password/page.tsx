"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resetPassword } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { friendlyPasswordError } from "@/lib/errors";

function ResetInner() {
  const router = useRouter();
  const search = useSearchParams();
  const toast = useToast();
  const tokenFromUrl = search.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!token.trim()) {
      toast.error(
        "Please paste the reset token from your email, or open the link we sent you.",
        "Reset token missing"
      );
      return;
    }
    if (password.length < 6) {
      toast.error(
        "Please choose a password with at least 6 characters.",
        "Password too short"
      );
      return;
    }
    if (password !== confirm) {
      toast.error(
        "The two passwords don't match. Please try again.",
        "Passwords don't match"
      );
      return;
    }

    setLoading(true);
    try {
      const r = await resetPassword(token, password);
      toast.success(
        r.message || "Your password has been reset. You can sign in now.",
        "Password updated"
      );
      // Give the shopper a beat to read the toast, then send them to sign in.
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      if (typeof console !== "undefined") console.error("reset-password failed:", err);
      toast.error(friendlyPasswordError(err), "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-small uppercase tracking-caps text-grey-600">
        Peptiva Labs · Choose a new password
      </p>
      <h1 className="mt-2 text-h1 font-normal text-black">
        Reset password
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        {!tokenFromUrl && (
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-black">Reset token</span>
            <input
              type="text"
              required
              placeholder="Paste the token from your email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="rounded-xl border border-grey-200 bg-white px-4 py-3 text-base text-black outline-none transition-colors placeholder:text-grey-600 focus:border-black"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-small font-medium text-black">New password</span>
          <input
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-grey-200 bg-white px-4 py-3 text-base text-black outline-none transition-colors placeholder:text-grey-600 focus:border-black"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-small font-medium text-black">Confirm password</span>
          <input
            type="password"
            required
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="rounded-xl border border-grey-200 bg-white px-4 py-3 text-base text-black outline-none transition-colors placeholder:text-grey-600 focus:border-black"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 w-full justify-center disabled:opacity-60"
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="mt-5 text-small text-grey-700">
        <Link href="/login" className="text-black hover:opacity-70">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pb-24 pt-28 sm:pt-32">
        <div className="shell">
          <Suspense fallback={<div className="text-grey-700">Loading…</div>}>
            <ResetInner />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
