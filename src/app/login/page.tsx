"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";
import { KeyRound, ShieldCheck, Upload, UserRoundCheck, ArrowRight, Terminal } from "lucide-react";

import { people } from "@/lib/data";

const loginFeatures = [
  {
    icon: UserRoundCheck,
    title: "Member ownership",
    text: "Each student, faculty member, or PhD scholar can edit only their own profile.",
  },
  {
    icon: Upload,
    title: "Resume & photo uploads",
    text: "Upload your resume PDF and profile photo directly from here after signing in.",
  },
  {
    icon: ShieldCheck,
    title: "Approval workflow",
    text: "Profile updates are reviewed before going live. Faculty can approve student profiles.",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return showMessage("Firebase not configured — environment variables not set.", "error");
    setIsLoading(true);
    setMessage("");
    try {
      let emailToUse = email.trim();
      if (!emailToUse.includes("@")) {
        // Resolve using local people data matching loginId (roll number)
        const match = people.find(
          (p) => p.loginId?.toLowerCase() === emailToUse.toLowerCase()
        );
        if (match) {
          emailToUse = match.officialEmail;
        } else {
          // Guess fallback
          emailToUse = `${emailToUse.toLowerCase()}@pg.iist.ac.in`;
        }
      }
      await signInWithEmailAndPassword(auth, emailToUse, password);
      showMessage(`✓ Signed in as ${emailToUse}. Redirecting to dashboard...`, "success");
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        showMessage("✗ Invalid credentials. Check your roll number and password.", "error");
      } else if (error.code === "auth/user-not-found") {
        showMessage("✗ No account found. Contact the admin to set up your profile.", "error");
      } else if (error.code === "auth/too-many-requests") {
        showMessage("✗ Too many attempts. Try again later or reset your password.", "error");
      } else {
        showMessage(error.message || String(err), "error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!auth) return showMessage("Firebase not configured.", "error");
    let emailToUse = email.trim();
    if (!emailToUse.includes("@")) {
      const match = people.find(
        (p) => p.loginId?.toLowerCase() === emailToUse.toLowerCase()
      );
      if (match) {
        emailToUse = match.officialEmail;
      } else {
        emailToUse = `${emailToUse.toLowerCase()}@pg.iist.ac.in`;
      }
    }
    try {
      await sendPasswordResetEmail(auth, emailToUse);
      showMessage(`✓ Password reset email sent to ${emailToUse}`, "success");
    } catch (err) {
      const error = err as { message?: string };
      showMessage(error.message || String(err), "error");
    }
  }

  return (
    <PageFrame>
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <ScrollReveal>
          <SectionLabel className="mb-3">Member Portal</SectionLabel>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
            Sign in to manage your profile and upload your resume.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--ceramic-muted)]">
            Use your IIST roll number (e.g. <code className="font-mono text-[var(--arc-blue)]">SC25M147</code>) as both
            your username and initial password.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          {/* ─── Login Form ─── */}
          <ScrollReveal variant="left" as="section">
            <GlassCard hover={false} variant="featured" accent="blue">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-[var(--arc-blue-dim)]">
                  <KeyRound size={20} className="text-[var(--arc-blue)]" aria-hidden />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Sign In</h2>
                  <p className="text-xs text-[var(--ceramic-muted)]">IIST Member Portal</p>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                    Roll Number or Email
                  </label>
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-metal"
                    placeholder="SC25M147 or name@pg.iist.ac.in"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-metal"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--arc-blue)] px-5 text-sm font-semibold text-white hover:brightness-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>Sign In <ArrowRight size={15} /></>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-[var(--edge)] bg-[var(--panel)] px-4 text-sm text-[var(--ceramic-muted)] hover:text-[var(--ceramic)] hover:border-[var(--arc-blue)] transition-all cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>

              {/* Message output */}
              {message && (
                <div className="mt-5 flex items-start gap-3">
                  <Terminal size={15} className="mt-0.5 shrink-0 text-[var(--ceramic-muted)]" />
                  <div
                    className={`terminal-readout flex-1 text-xs ${
                      messageType === "error" ? "error" : messageType === "success" ? "" : "info"
                    }`}
                  >
                    <span className="font-data text-[9px] uppercase tracking-wider opacity-60 block mb-1">
                      AUTH-RESPONSE
                    </span>
                    {message}
                  </div>
                </div>
              )}

              <div className="mt-6 border-t border-[var(--edge)] pt-4">
                <p className="text-xs text-[var(--ceramic-muted)]">
                  <span className="font-semibold text-[var(--ceramic)]">First time?</span>{" "}
                  Your initial password is your roll number. Change it from the dashboard after signing in.
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* ─── Features ─── */}
          <ScrollReveal variant="right" as="section">
            <div className="space-y-4">
              {loginFeatures.map(({ icon: Icon, title, text }) => (
                <GlassCard key={title}>
                  <div className="flex items-start gap-4">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--forge-amber-dim)]">
                      <Icon size={18} className="text-[var(--forge-amber)]" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-[var(--ceramic)]">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--ceramic-muted)]">{text}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}

              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--arc-blue-dim)]">
                    <KeyRound size={18} className="text-[var(--arc-blue)]" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-[var(--ceramic)]">
                      After signing in
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--ceramic-muted)]">
                      You can upload your resume PDF, update your synopsis, add custom profile sections, 
                      and manage contact visibility from the dashboard.
                    </p>
                    <div className="mt-3">
                      <MetalButton href="/dashboard" variant="ghost">
                        Go to Dashboard <ArrowRight size={13} />
                      </MetalButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </PageFrame>
  );
}
