"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";
import { KeyRound, Upload, ShieldCheck, Terminal } from "lucide-react";
import { people } from "@/lib/data";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");
  const [currentUser, setCurrentUser] = useState<any>(null);

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  useEffect(() => {
    // 1. Check for active mock user session
    const savedMock = sessionStorage.getItem("mock-user");
    if (savedMock) {
      try {
        const u = JSON.parse(savedMock);
        setCurrentUser(u);
        const match = people.find((p) => p.officialEmail === u.email);
        if (match) setSlug(match.slug);
      } catch (e) {
        console.error("Failed to parse mock user:", e);
      }
    }

    // 2. Listen to live Firebase Auth state
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
          const match = people.find((p) => p.officialEmail === user.email);
          if (match) setSlug(match.slug);
        } else if (!sessionStorage.getItem("mock-user")) {
          setCurrentUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  async function signIn() {
    setMessage("");
    
    // Offline bypass validation check
    const match = people.find(
      (p) => p.loginId?.toLowerCase() === email.trim().toLowerCase() && 
             (password === p.loginId || password.trim().toUpperCase() === p.loginId?.toUpperCase())
    );
    if (match) {
      const mockUser = {
        uid: match.slug,
        email: match.officialEmail,
        displayName: match.name,
      };
      sessionStorage.setItem("mock-user", JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setSlug(match.slug);
      showMessage(`✓ Authenticated locally as ${match.officialEmail} (Offline Mode)`, "success");
      return;
    }

    if (!auth) return showMessage("Firebase not configured — add environment variables to enable.", "error");
    try {
      let emailToUse = email.trim();
      if (!emailToUse.includes("@")) {
        const candidate = people.find((p) => p.loginId?.toLowerCase() === emailToUse.toLowerCase());
        if (candidate) {
          emailToUse = candidate.officialEmail;
        } else {
          emailToUse = `${emailToUse.toLowerCase()}@pg.iist.ac.in`;
        }
      }
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      sessionStorage.removeItem("mock-user"); // Clear offline session if online succeeds
      setCurrentUser(cred.user);
      showMessage(`✓ Authenticated as ${emailToUse}`, "success");
      const m = people.find((p) => p.officialEmail === emailToUse);
      if (m) setSlug(m.slug);
    } catch (err: any) {
      showMessage(err.message || String(err), "error");
    }
  }

  async function signOutUser() {
    sessionStorage.removeItem("mock-user");
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setSlug("");
    showMessage("Logged out successfully.", "info");
  }

  async function forgotPassword() {
    if (!auth) return showMessage("Firebase not configured", "error");
    try {
      let targetEmail = email;
      if (!targetEmail.includes("@")) targetEmail = `${email}@pg.iist.ac.in`;
      await sendPasswordResetEmail(auth, targetEmail);
      showMessage(`✓ Password reset email sent to ${targetEmail}`, "success");
    } catch (err: any) {
      showMessage(err.message || String(err), "error");
    }
  }

  async function upload() {
    if (!currentUser) return showMessage("Sign in first", "error");
    if (!file) return showMessage("Choose a file to upload", "error");

    let token = "mock-token";
    if (currentUser.getIdToken) {
      try {
        token = await currentUser.getIdToken();
      } catch (e) {
        console.warn("Failed to get Firebase ID token, using mock-token:", e);
      }
    }

    const fd = new FormData();
    fd.append("slug", slug || currentUser.uid);
    fd.append("resume", file);
    showMessage("Uploading...", "info");
    
    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (res.ok) {
        showMessage(`✓ Upload complete: ${j.downloadUrl}`, "success");
        // Save dynamically to Firestore client-side using Firebase SDK
        if (db) {
          const targetSlug = slug || currentUser.uid;
          try {
            await setDoc(doc(db, "profiles", targetSlug), {
              resumeUrl: j.downloadUrl,
              firebaseStorageUrl: j.storageUrl || null,
              updatedAt: new Date().toISOString(),
            }, { merge: true });
            console.log(`Firestore updated client-side for ${targetSlug}`);
          } catch (dbErr: any) {
            console.error("Firestore client-side update failed:", dbErr);
          }
        }
      } else {
        showMessage(`✗ Error: ${j.error || JSON.stringify(j)}`, "error");
      }
    } catch (err: any) {
      showMessage(err.message || String(err), "error");
    }
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
            {currentUser ? (
              <GlassCard hover={false} variant="featured" accent="blue">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-[var(--arc-blue-dim)]">
                    <KeyRound size={20} className="text-[var(--arc-blue)]" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Active Session</h2>
                    <p className="text-xs text-[var(--ceramic-muted)]">Signed in successfully</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block font-data text-[10px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">
                      Authenticated Account
                    </span>
                    <p className="font-semibold text-sm text-[var(--ceramic)] break-all">{currentUser.email}</p>
                  </div>
                  <div>
                    <span className="block font-data text-[10px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">
                      Assigned Profile Slug
                    </span>
                    <code className="font-mono text-xs text-[var(--arc-blue)]">{slug || "Not found in directory"}</code>
                  </div>
                  <div className="pt-2">
                    <MetalButton onClick={signOutUser} className="w-full justify-center">
                      Sign Out
                    </MetalButton>
                  </div>
                </div>
              </GlassCard>
            ) : (
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
                      placeholder="sc25m147 or name@pg.iist.ac.in"
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
            )}
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
                      disabled={!!currentUser}
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
                  <MetalButton variant="secondary" onClick={upload} disabled={!currentUser}>
                    Upload Resume PDF
                  </MetalButton>
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
                  {currentUser ? (
                    <span className="text-[var(--laser-green)] font-semibold">✓ Connected and Authenticated. Ready for resume uploads.</span>
                  ) : (
                    <span>Firebase Auth and Storage are integrated. Use your roll number for instant offline access or backend-synced login.</span>
                  )}
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
