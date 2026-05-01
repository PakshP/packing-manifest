"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { APP_NAME } from "@/lib/config";
import TopoPattern from "@/components/patterns/TopoPattern";

type Phase = "checking" | "ready" | "invalid" | "saving" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let resolved = false;

    const settle = (next: Phase) => {
      if (resolved) return;
      resolved = true;
      setPhase(next);
    };

    // Supabase fires PASSWORD_RECOVERY when it processes the recovery hash.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        settle("ready");
      }
    });

    // The hash may have already been processed before this component mounted.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) settle("ready");
    });

    // If nothing arrived in a few seconds, the link is bad or expired.
    const timeout = setTimeout(() => settle("invalid"), 4000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setPhase("saving");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setPhase("ready");
      return;
    }
    setPhase("done");
    setTimeout(() => router.replace("/"), 1500);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-ink-primary topo-bg flex items-center justify-center p-4">
      <TopoPattern
        className="absolute inset-0 h-full w-full text-ink-secondary"
        opacity={0.12}
        density="medium"
      />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-border-soft bg-bg-elevated shadow-xl grain-overlay">
        <div className="p-6 sm:p-8">
          <p className="field-label">Recovery</p>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold leading-tight text-ink-primary">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Choose a new password for your {APP_NAME} account.
          </p>

          {phase === "checking" && (
            <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-widest text-ink-tertiary">
              Validating recovery link…
            </p>
          )}

          {phase === "invalid" && (
            <div className="mt-6 space-y-3">
              <p className="rounded-md border border-accent-rust/40 bg-accent-rust/10 p-3 text-sm text-accent-rust">
                This recovery link is invalid or has expired. Request a new one.
              </p>
              <button
                type="button"
                onClick={() => router.replace("/")}
                className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary transition-colors hover:text-ink-primary"
              >
                <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                Back to sign in
              </button>
            </div>
          )}

          {(phase === "ready" || phase === "saving") && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="new-pw" className="field-label block mb-1.5">
                  New password
                </label>
                <input
                  id="new-pw"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={phase === "saving"}
                  className="w-full rounded-md border border-border-strong bg-bg-paper px-3 py-2.5 text-ink-primary outline-none transition-colors focus:border-accent-moss disabled:opacity-60"
                />
              </div>
              <div>
                <label htmlFor="confirm-pw" className="field-label block mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm-pw"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={phase === "saving"}
                  className="w-full rounded-md border border-border-strong bg-bg-paper px-3 py-2.5 text-ink-primary outline-none transition-colors focus:border-accent-moss disabled:opacity-60"
                />
              </div>

              {error && (
                <p className="text-sm text-accent-rust" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={phase === "saving"}
                className="w-full rounded-md bg-accent-moss py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-moss/90 disabled:opacity-60"
              >
                {phase === "saving" ? "Saving…" : "Update password"}
              </button>
            </form>
          )}

          {phase === "done" && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-accent-moss/30 bg-accent-moss/5 px-3 py-2 text-sm text-accent-moss">
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Password updated. Redirecting…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
