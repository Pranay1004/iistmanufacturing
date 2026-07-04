"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, signOut } from "firebase/auth";
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
  const [firebaseAttempts, setFirebaseAttempts] = useState(0);
  const [firebaseCooldownUntil, setFirebaseCooldownUntil] = useState(0);

  useEffect(() => {
    const isMock = !!localStorage.getItem("mock-user");
    const isFirebase = localStorage.getItem("firebase-logged-in") === "true";
    if (isMock || isFirebase) {
      window.location.href = "/dashboard";
    }
  }, []);

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 1. Check if this looks like a roll number login (not an email)
    const isRollNumberInput = !trimmedEmail.includes("@");
    const knownPerson = people.find(
      (p) => p.loginId?.toLowerCase() === trimmedEmail || p.officialEmail.toLowerCase() === trimmedEmail
    );

    // 2. LOCAL AUTH — primary path for all roll-number logins
    if (knownPerson && knownPerson.loginId) {
      const passwordMatches = 
        trimmedPassword === knownPerson.loginId ||
        trimmedPassword.toUpperCase() === knownPerson.loginId.toUpperCase();

      if (passwordMatches) {
        const mockUser = {
          uid: knownPerson.slug,
          email: knownPerson.officialEmail,
          displayName: knownPerson.name,
        };
        localStorage.setItem("mock-user", JSON.stringify(mockUser));
        showMessage(`✓ Authenticated as ${knownPerson.officialEmail}. Redirecting...`, "success");
        setIsLoading(false);
        setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
        return;
      } else {
        // Roll number recognized but wrong password — DON'T fall through to Firebase
        setIsLoading(false);
        showMessage(
          `✗ Incorrect password for ${knownPerson.name}. Your initial password is your roll number (e.g. ${knownPerson.loginId}). If you changed it, use Forgot Password.`,
          "error"
        );
        return;
      }
    }

    // 3. For roll number inputs that don't match any known person
    if (isRollNumberInput && !knownPerson) {
      setIsLoading(false);
      showMessage(
        `✗ Roll number "${email.trim()}" not found in the directory. Check for typos or contact the admin.`,
        "error"
      );
      return;
    }

    // 4. FIREBASE AUTH — only for email-based logins (not roll numbers)
    if (!auth) {
      setIsLoading(false);
      return showMessage("Firebase not configured — environment variables not set.", "error");
    }

    // Client-side rate-limit guard
    const now = Date.now();
    if (now < firebaseCooldownUntil) {
      const waitSec = Math.ceil((firebaseCooldownUntil - now) / 1000);
      setIsLoading(false);
      return showMessage(
        `⏳ Too many attempts. Please wait ${waitSec}s before trying again.`,
        "error"
      );
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      localStorage.removeItem("mock-user");
      localStorage.setItem("firebase-logged-in", "true");
      setFirebaseAttempts(0);
      showMessage(`✓ Signed in as ${trimmedEmail}. Redirecting to dashboard...`, "success");
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (err) {
      const error = err as { code?: string; message?: string };
      console.error("Login Error:", error);

      if (error.code === "auth/too-many-requests") {
        // Exponential backoff: 30s, 60s, 120s, 240s...
        const backoffMs = Math.min(30000 * Math.pow(2, firebaseAttempts), 300000);
        setFirebaseCooldownUntil(Date.now() + backoffMs);
        setFirebaseAttempts((prev) => prev + 1);
        showMessage(
          `✗ Firebase has temporarily blocked this account due to too many failed attempts. Wait ${Math.ceil(backoffMs / 1000)}s, then try again. Tip: Use your roll number as both username AND password for instant offline login.`,
          "error"
        );
      } else if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setFirebaseAttempts((prev) => prev + 1);
        if (firebaseAttempts >= 3) {
          const backoffMs = 30000;
          setFirebaseCooldownUntil(Date.now() + backoffMs);
          showMessage(
            `✗ Multiple failed attempts. Cooling down for 30s to prevent lockout. Use Forgot Password to reset, or try your roll number for offline access.`,
            "error"
          );
        } else {
          showMessage(`✗ Invalid email or password. Attempts: ${firebaseAttempts + 1}/4 before cooldown.`, "error");
        }
      } else {
        showMessage(`✗ Sign-in failed: ${error.message || String(err)}`, "error");
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

  const [isSeeding, setIsSeeding] = useState(false);

  async function handleSeedAuth() {
    if (!auth) return showMessage("Firebase not configured.", "error");
    setIsSeeding(true);
    showMessage("Starting account initialization...", "info");
    let createdCount = 0;
    let existedCount = 0;
    let errorCount = 0;
    let lastError: string | null = null;

    const candidates = people.filter((p) => p.loginId);

    for (const person of candidates) {
      try {
        await createUserWithEmailAndPassword(auth, person.officialEmail, person.loginId as string);
        await signOut(auth);
        createdCount++;
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          existedCount++;
        } else {
          console.error(`Error creating ${person.officialEmail}:`, err);
          lastError = err.message || String(err);
          errorCount++;
        }
      }
    }

    if (errorCount > 0) {
      showMessage(
        `Auth sync: ${createdCount} created, ${existedCount} existed, ${errorCount} errors. Last error: ${lastError}`,
        "error"
      );
    } else {
      showMessage(
        `Auth sync complete: ${createdCount} new accounts created, ${existedCount} already existed.`,
        "success"
      );
    }
    setIsSeeding(false);
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
                <button
                  type="button"
                  onClick={handleSeedAuth}
                  disabled={isSeeding}
                  className="mt-3 w-full text-left text-xs font-semibold text-[var(--arc-blue)] hover:text-[var(--forge-amber)] transition-colors cursor-pointer border border-[var(--edge)] bg-[var(--void)] rounded-md px-3 py-2 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isSeeding ? "⚙️ Synchronizing members..." : "⚙️ Sync Student Accounts to Firebase"}
                </button>
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
