"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Compass, Map, Mountain } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import TopoPattern from "@/components/patterns/TopoPattern";

type Mode = "signin" | "signup" | "forgot";

const PITCH = [
  {
    icon: Compass,
    title: "Plan like an expedition",
    body: "Eight categories of essentials for month-long trips, ready to customize.",
  },
  {
    icon: Mountain,
    title: "Pack with intention",
    body: "Assign every item to a bag. See exactly what's where, when you need it.",
  },
  {
    icon: Map,
    title: "Auto-saved, anywhere",
    body: "Sign in on any device — your manifest is always one tap from ready.",
  },
];

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
        });
        if (err) throw err;
        if (data.user && !data.session) {
          setInfo("Check your inbox to confirm your email, then sign in.");
        }
      } else if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
      } else {
        // forgot
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setInfo(
          "Check your inbox for a reset link. It's good for one hour."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  const isForgot = mode === "forgot";
  const submitLabel = busy
    ? "…"
    : mode === "signin"
      ? "Log In"
      : mode === "signup"
        ? "Create Account"
        : "Send reset link";

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-ink-primary topo-bg">
      <TopoPattern
        className="absolute inset-0 h-full w-full text-ink-secondary"
        opacity={0.12}
        density="medium"
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — pitch */}
          <div className="flex flex-col justify-center">
            <p className="field-label">N 47°&nbsp;·&nbsp;Field Guide&nbsp;·&nbsp;Vol. 01</p>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight text-ink-primary">
              {APP_NAME}
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink-secondary">
              {APP_TAGLINE}{" "}
              A multi-user packing list for serious adventures and month-long
              trips.
            </p>

            <ul className="mt-10 space-y-5">
              {PITCH.map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-moss/10 text-accent-moss">
                    <p.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-ink-primary">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-secondary">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — auth card */}
          <div className="flex items-center">
            <div className="w-full rounded-xl border border-border-soft bg-bg-elevated shadow-xl grain-overlay">
              <div className="p-6 sm:p-8">
                {!isForgot ? (
                  <div
                    role="tablist"
                    aria-label="Auth mode"
                    className="grid grid-cols-2 rounded-md border border-border-soft bg-bg-paper p-1"
                  >
                    {(["signin", "signup"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => switchMode(m)}
                        className={`font-mono text-[0.7rem] uppercase tracking-widest py-2 rounded transition-colors ${
                          mode === m
                            ? "bg-accent-moss text-white shadow-sm"
                            : "text-ink-secondary hover:text-ink-primary"
                        }`}
                      >
                        {m === "signin" ? "Log In" : "Sign Up"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary transition-colors hover:text-ink-primary"
                    >
                      <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                      Back to log in
                    </button>
                    <h2 className="mt-3 font-display text-xl font-bold text-ink-primary">
                      Reset your password
                    </h2>
                    <p className="mt-1 text-sm text-ink-secondary">
                      Enter your email and we&apos;ll send you a recovery link.
                    </p>
                  </div>
                )}

                <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="field-label block mb-1.5"
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-border-strong bg-bg-paper px-3 py-2.5 text-ink-primary outline-none transition-colors focus:border-accent-moss"
                    />
                  </div>

                  {!isForgot && (
                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <label
                          htmlFor="password"
                          className="field-label"
                        >
                          Password
                        </label>
                        {mode === "signin" && (
                          <button
                            type="button"
                            onClick={() => switchMode("forgot")}
                            className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary transition-colors hover:text-accent-moss"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <input
                        id="password"
                        type="password"
                        autoComplete={
                          mode === "signin"
                            ? "current-password"
                            : "new-password"
                        }
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-border-strong bg-bg-paper px-3 py-2.5 text-ink-primary outline-none transition-colors focus:border-accent-moss"
                      />
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-accent-rust" role="alert">
                      {error}
                    </p>
                  )}
                  {info && (
                    <p className="text-sm text-accent-moss" role="status">
                      {info}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-md bg-accent-moss py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-moss/90 disabled:opacity-60"
                  >
                    {submitLabel}
                  </button>
                </form>

                {!isForgot && (
                  <>
                    <div className="my-6 trail-divider" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={handleGoogle}
                      disabled={busy}
                      className="flex w-full items-center justify-center gap-3 rounded-md border border-border-strong bg-bg-paper py-2.5 text-sm font-medium text-ink-primary transition-colors hover:bg-bg-base disabled:opacity-60"
                    >
                      <GoogleLogo className="h-4 w-4" />
                      Continue with Google
                    </button>

                    <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary text-center">
                      By continuing you agree to a quietly-saved manifest.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.4 6.4 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.4 6.4 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.5c-1.9 1.4-4.4 2.4-7.5 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 38.9 16.3 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.5c-.5.5 7-5.1 7-15.2 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
