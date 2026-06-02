"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";
import { Divider } from "@/components/ui/Divider";
import { KeyRound, Upload, ShieldCheck, Terminal } from "lucide-react";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  async function signIn() {
    if (!auth) return showMessage("Firebase not configured — add environment variables to enable.", "error");
    try {
      let emailToUse = email;
      if (!email.includes("@")) {
        const candidates = [`${email}@pg.iist.ac.in`, `${email}@iist.ac.in`, `${email}@iist.local`];
        let signed = false;
        for (const cand of candidates) {
          try {
            await signInWithEmailAndPassword(auth, cand, password);
            showMessage(`✓ Authenticated as ${cand}`, "success");
            signed = true;
            break;
          } catch {
            // try next
          }
        }
        if (signed) return;
        emailToUse = `${email}@pg.iist.ac.in`;
      }
      await signInWithEmailAndPassword(auth, emailToUse, password);
      showMessage(`✓ Authenticated as ${emailToUse}`, "success");
    } catch (err) {
      const error = err as Error;
      showMessage(error.message || String(err), "error");
    }
  }

  async function forgotPassword() {
    if (!auth) return showMessage("Firebase not configured", "error");
    try {
      let targetEmail = email;
      if (!targetEmail.includes("@")) targetEmail = `${email}@pg.iist.ac.in`;
      await sendPasswordResetEmail(auth, targetEmail);
      showMessage(`✓ Password reset email sent to ${targetEmail}`, "success");
    } catch (err) {
      const error = err as Error;
      showMessage(error.message || String(err), "error");
    }
  }

  async function upload() {
    if (!auth || !auth.currentUser) return showMessage("Sign in first", "error");
    if (!file) return showMessage("Choose a file to upload", "error");
    const token = await auth.currentUser.getIdToken();
    const fd = new FormData();
    fd.append("slug", slug || auth.currentUser.uid);
    fd.append("resume", file);
    showMessage("Uploading...", "info");
    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: fd,
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await res.json();
    if (res.ok) showMessage(`✓ Upload complete: ${j.downloadUrl}`, "success");
    else showMessage(`✗ Error: ${j.error || JSON.stringify(j)}`, "error");
  }

  return (
    <PageFrame>
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <ScrollReveal>
          <SectionLabel className="mb-3">Control Room</SectionLabel>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
            Member Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ceramic-muted)]">
            Authenticate with your IIST credentials to manage your profile, upload resumes, and track publication status.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          {/* ─── Authentication ─── */}
          <ScrollReveal variant="left" as="section">
            <GlassCard hover={false} variant="featured" accent="blue">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-[var(--arc-blue-dim)]">
                  <KeyRound size={20} className="text-[var(--arc-blue)]" aria-hidden />
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Sign In</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                    Email or Username
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-metal"
                    placeholder="sc22b001 or name@pg.iist.ac.in"
                  />
                </div>
                <div>
                  <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-metal"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <MetalButton onClick={signIn}>Sign In</MetalButton>
                  <MetalButton variant="ghost" onClick={forgotPassword}>Forgot Password</MetalButton>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* ─── Status & Upload ─── */}
          <ScrollReveal variant="right" as="section">
            <div className="space-y-5">
              <GlassCard variant="featured" accent="amber">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-[var(--forge-amber-dim)]">
                    <Upload size={20} className="text-[var(--forge-amber)]" aria-hidden />
                  </div>
                  <h2 className="font-display text-xl font-bold text-[var(--ceramic)]">Upload Resume</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                      Profile Slug (optional)
                    </label>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="input-metal"
                      placeholder="e.g. pranay-pandey"
                    />
                  </div>
                  <div>
                    <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                      Resume (PDF)
                    </label>
                    <div className="relative rounded-[var(--radius-md)] border border-dashed border-[var(--edge)] bg-[var(--void)] p-4 text-center transition-colors hover:border-[var(--forge-amber)]">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload size={20} className="mx-auto text-[var(--ceramic-muted)] mb-1" aria-hidden />
                      <p className="text-sm text-[var(--ceramic-muted)]">
                        {file ? file.name : "Drop PDF or click to browse"}
                      </p>
                    </div>
                  </div>
                  <MetalButton variant="secondary" onClick={upload}>Upload Resume PDF</MetalButton>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-[var(--arc-blue-dim)]">
                    <ShieldCheck size={18} className="text-[var(--arc-blue)]" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[var(--ceramic)]">System Status</h3>
                </div>
                <p className="text-sm leading-6 text-[var(--ceramic-muted)]">
                  Firebase Auth, Firestore, and Storage are scaffolded. Add Vercel environment
                  variables and enable Google Auth to activate the live provider.
                </p>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>

        {/* ─── Terminal Message Output ─── */}
        {message && (
          <ScrollReveal className="mt-8">
            <div className="flex items-start gap-3">
              <Terminal size={16} className="mt-1 shrink-0 text-[var(--ceramic-muted)]" aria-hidden />
              <div className={`terminal-readout flex-1 ${messageType === "error" ? "error" : messageType === "success" ? "" : "info"}`}>
                <span className="font-data text-[9px] uppercase tracking-wider opacity-60 block mb-1">
                  SYS-OUTPUT // {new Date().toLocaleTimeString()}
                </span>
                {message}
              </div>
            </div>
          </ScrollReveal>
        )}
      </main>
    </PageFrame>
  );
}
