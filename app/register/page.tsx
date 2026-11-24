"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";
import { friendlyRegisterError } from "@/lib/errors";
import AuthShell, { Eyebrow, INPUT } from "@/components/AuthShell";

function RegisterInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";
  const { register, loading } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    date_of_birth: "",
    nationality: "",
    country_of_residence: "",
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error(
        "Please choose a password with at least 6 characters.",
        "Password too short"
      );
      return;
    }
    try {
      const user = await register(form);
      toast.success(
        `Welcome to Peptiva Labs${user.name ? `, ${user.name.split(" ")[0]}` : ""}.`,
        "Account created"
      );
      router.push(next);
    } catch (err) {
      if (typeof console !== "undefined") console.error("register failed:", err);
      toast.error(friendlyRegisterError(err), "We couldn't create your account");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <Eyebrow>Get started</Eyebrow>
      <h1 className="mt-4 text-[28px] font-medium leading-tight text-black sm:text-[34px]">
        Create your Peptiva Labs account
      </h1>
      <p className="mt-2 text-base text-grey-700">
        Register to track orders, earn wallet credit, and access the
        Peptiva Labs affiliate program.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <TextField
          label="Full name"
          value={form.name}
          onChange={(v) => update("name", v)}
          placeholder="Jane Doe"
          required
          full
          autoComplete="name"
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="you@lab.com"
          required
          full
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => update("password", v)}
          placeholder="At least 6 characters"
          required
          full
          autoComplete="new-password"
        />
        <TextField
          label="Date of birth"
          type="date"
          value={form.date_of_birth}
          onChange={(v) => update("date_of_birth", v)}
          required
          autoComplete="bday"
        />
        <TextField
          label="Nationality"
          value={form.nationality}
          onChange={(v) => update("nationality", v)}
          placeholder="Nationality"
          required
        />
        <TextField
          label="Country of residence"
          value={form.country_of_residence}
          onChange={(v) => update("country_of_residence", v)}
          placeholder="Country"
          required
          full
          autoComplete="country-name"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-1 w-full justify-center sm:col-span-2"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-small text-grey-700">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-black underline underline-offset-4 hover:opacity-60"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      img="/new-images/auth/register-hd.webp"
      tag="Join Peptiva Labs"
      title="Track every order and earn credit on the next one."
      points={["Order tracking", "Wallet credit", "Affiliate code"]}
    >
      <Suspense fallback={<div className="text-grey-700">Loading…</div>}>
        <RegisterInner />
      </Suspense>
    </AuthShell>
  );
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  full = false,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-small font-medium text-black">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </label>
  );
}
