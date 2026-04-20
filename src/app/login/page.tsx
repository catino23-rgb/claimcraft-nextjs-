"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpError) {
        setError(otpError.message);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  if (!configured) {
    return (
      <div className="bg-white border border-stone-200 shadow-sm p-6">
        <h2
          className="text-lg mb-2 text-slate-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Auth not configured
        </h2>
        <p className="text-sm text-stone-600 mb-4">
          Supabase environment variables are not set. The app is running in
          local-only mode — claims are stored in your browser&rsquo;s
          localStorage.
        </p>
        <Link
          href="/"
          className="inline-block text-xs tracking-widest uppercase text-amber-700 hover:text-amber-800 border-b border-amber-500"
        >
          Continue to dashboard
        </Link>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="bg-white border border-stone-200 shadow-sm p-6">
        <h2
          className="text-lg mb-2 text-slate-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Check your email
        </h2>
        <p className="text-sm text-stone-600">
          We sent a sign-in link to{" "}
          <span className="font-mono text-slate-900">{email}</span>. Open it on
          this device to finish signing in.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setEmail("");
          }}
          className="mt-4 text-xs tracking-widest uppercase text-amber-700 hover:text-amber-800 border-b border-amber-500"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 shadow-sm p-6 space-y-4"
    >
      <div>
        <h2
          className="text-lg text-slate-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Sign in
        </h2>
        <p className="text-xs tracking-widest text-stone-500 uppercase mt-1">
          Magic link &middot; No password
        </p>
      </div>

      {urlError && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">
          {decodeURIComponent(urlError)}
        </div>
      )}

      <label className="block">
        <span className="text-xs tracking-widest uppercase text-stone-600">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-amber-500 disabled:bg-stone-50"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
        />
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !email}
        className="w-full bg-slate-900 text-amber-400 py-2 text-sm tracking-widest uppercase hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending\u2026" : "Send magic link"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="bg-slate-900 text-stone-100 border-b-2 border-amber-500">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 flex items-center justify-center">
            <Shield size={20} className="text-slate-900" />
          </div>
          <div>
            <div
              className="text-xl tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ClaimCraft<span className="text-amber-500">.</span>
            </div>
            <div className="text-[10px] tracking-widest text-stone-400 uppercase">
              Policyholder Advocacy Toolkit
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="bg-white border border-stone-200 shadow-sm p-6 text-sm text-stone-500">
                Loading&hellip;
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-6 text-xs text-stone-500 border-t border-stone-200 w-full">
        <p>
          ClaimCraft &middot; Prototype &middot; Not legal or regulatory advice
        </p>
      </footer>
    </div>
  );
}
