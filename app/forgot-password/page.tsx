"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { forgotPassword } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { friendlyPasswordError } from "@/lib/errors";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const r = await forgotPassword(email);
      toast.success(
        r.message ||
          "If an account exists with this email, a password reset link has been sent.",
        "Check your inbox"
      );
      setEmail("");
    } catch (err) {
      if (typeof console !== "undefined") console.error("forgot-password failed:", err);
      toast.error(friendlyPasswordError(err), "Reset link not sent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-white pb-24 pt-28 sm:pt-32">
        <div className="shell">
          <div className="mx-auto w-full max-w-md">
            <p className="text-small uppercase tracking-caps text-grey-600">
              Peptiva Labs · Password reset
            </p>
            <h1 className="mt-2 text-h1 font-normal text-black">
              Forgot password
            </h1>
            <p className="mt-3 text-base text-grey-700">
              Enter the email on your account and we&rsquo;ll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-small font-medium text-black">Email</span>
                <input
                  type="email"
                  required
                  placeholder="you@lab.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-grey-200 bg-white px-4 py-3 text-base text-black outline-none transition-colors placeholder:text-grey-600 focus:border-black"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2 w-full justify-center disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-5 text-small text-grey-700">
              Remembered it?{" "}
              <Link href="/login" className="text-black hover:opacity-70">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
