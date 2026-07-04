"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";
import { Divider } from "@/components/ui/Divider";
import { KeyRound, Upload, ShieldCheck, Terminal } from "lucide-react";
import { people } from "@/lib/data";
import { sanitizeInput, isValidEmail, isValidUrl, validateFileUpload } from "@/lib/security";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Profile Editor States
  const [synopsis, setSynopsis] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [profileSections, setProfileSections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  useEffect(() => {
    // 1. Check for active mock user session in localStorage
    const savedMock = localStorage.getItem("mock-user");
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
          localStorage.setItem("firebase-logged-in", "true");
          const match = people.find((p) => p.officialEmail === user.email);
          if (match) setSlug(match.slug);
        } else if (!localStorage.getItem("mock-user")) {
          setCurrentUser(null);
          localStorage.removeItem("firebase-logged-in");
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync profile details when slug changes
  useEffect(() => {
    if (!currentUser || !slug) return;
    const match = people.find((p) => p.slug === slug);
    if (match) {
      setSynopsis(match.synopsis || "");
      setPersonalEmail(match.personalEmail || "");
      setLinkedin(match.linkedin || "");
      setPortfolio(match.portfolio || "");
      setSkillsText(match.skills ? match.skills.join(", ") : "");
      setProjects(match.projects || []);
      setProfileSections(match.profileSections || []);
    }

    if (db) {
      getDoc(doc(db, "profiles", slug))
        .then((snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.synopsis !== undefined) setSynopsis(data.synopsis);
            if (data.personalEmail !== undefined) setPersonalEmail(data.personalEmail);
            if (data.linkedin !== undefined) setLinkedin(data.linkedin);
            if (data.portfolio !== undefined) setPortfolio(data.portfolio);
            if (data.skills !== undefined) setSkillsText(data.skills.join(", "));
            if (data.projects !== undefined) setProjects(data.projects);
            if (data.profileSections !== undefined) setProfileSections(data.profileSections);
          }
        })
        .catch((err) => console.error("Error loading profile details in editor:", err));
    }
  }, [currentUser, slug]);

  async function signIn() {
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 1. Check if this is a known roll number or email
    const knownPerson = people.find(
      (p) => p.loginId?.toLowerCase() === trimmedEmail || p.officialEmail.toLowerCase() === trimmedEmail
    );
    const isRollNumberInput = !trimmedEmail.includes("@");

    // 2. LOCAL AUTH — primary path for known users
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
        setCurrentUser(mockUser);
        setSlug(knownPerson.slug);
        showMessage(`✓ Authenticated as ${knownPerson.officialEmail}`, "success");
        return;
      } else {
        showMessage(
          `✗ Incorrect password for ${knownPerson.name}. Your initial password is your roll number (${knownPerson.loginId}). Use Forgot Password if you changed it.`,
          "error"
        );
        return;
      }
    }

    // 3. Unknown roll number
    if (isRollNumberInput && !knownPerson) {
      showMessage(`✗ Roll number "${email.trim()}" not found in the directory.`, "error");
      return;
    }

    // 4. FIREBASE AUTH — only for email-based logins
    if (!auth) return showMessage("Firebase not configured — add environment variables to enable.", "error");
    try {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      localStorage.removeItem("mock-user");
      localStorage.setItem("firebase-logged-in", "true");
      setCurrentUser(cred.user);
      showMessage(`✓ Authenticated as ${trimmedEmail}`, "success");
      const m = people.find((p) => p.officialEmail === trimmedEmail);
      if (m) setSlug(m.slug);
    } catch (err: any) {
      if (err.code === "auth/too-many-requests") {
        showMessage(
          "✗ Too many failed attempts — Firebase has temporarily blocked this account. Wait a few minutes, or use your roll number for instant offline access.",
          "error"
        );
      } else {
        showMessage(err.message || String(err), "error");
      }
    }
  }

  async function signOutUser() {
    localStorage.removeItem("mock-user");
    localStorage.removeItem("firebase-logged-in");
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

    // Client-side file validation before upload
    const fileError = validateFileUpload(file);
    if (fileError) return showMessage(`✗ ${fileError}`, "error");

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

  async function saveProfile() {
    if (!currentUser || !slug) return showMessage("Sign in first", "error");
    if (!db) return showMessage("Firestore not configured", "error");

    // ── Input Validation ──────────────────────────────────────
    const cleanEmail = personalEmail.trim();
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return showMessage("✗ Invalid email format.", "error");
    }

    const cleanLinkedin = linkedin.trim();
    if (cleanLinkedin && !isValidUrl(cleanLinkedin)) {
      return showMessage("✗ LinkedIn URL must be a valid HTTPS link.", "error");
    }

    const cleanPortfolio = portfolio.trim();
    if (cleanPortfolio && !isValidUrl(cleanPortfolio)) {
      return showMessage("✗ Portfolio URL must be a valid HTTPS link.", "error");
    }

    setIsSaving(true);
    showMessage("Saving profile...", "info");

    try {
      // ── Sanitize All Inputs ────────────────────────────────
      const sanitizedSynopsis = sanitizeInput(synopsis, 2000);
      const parsedSkills = skillsText
        .split(",")
        .map((s) => sanitizeInput(s, 100))
        .filter(Boolean)
        .slice(0, 30); // max 30 skills

      const sanitizedProjects = projects.map((p: any) => ({
        title: sanitizeInput(p.title || "", 200),
        summary: sanitizeInput(p.summary || "", 1000),
        status: ["Concept", "Ongoing", "Completed"].includes(p.status) ? p.status : "Concept",
      })).slice(0, 20); // max 20 projects

      const sanitizedSections = profileSections.map((s: any) => ({
        title: sanitizeInput(s.title || "", 200),
        body: sanitizeInput(s.body || "", 2000),
        items: Array.isArray(s.items)
          ? s.items.map((item: string) => sanitizeInput(item, 500)).slice(0, 20)
          : undefined,
      })).slice(0, 15); // max 15 sections

      await setDoc(doc(db, "profiles", slug), {
        synopsis: sanitizedSynopsis,
        personalEmail: sanitizeInput(cleanEmail, 254),
        linkedin: sanitizeInput(cleanLinkedin, 500),
        portfolio: sanitizeInput(cleanPortfolio, 500),
        skills: parsedSkills,
        projects: sanitizedProjects,
        profileSections: sanitizedSections,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      showMessage("✓ Profile saved successfully!", "success");
    } catch (err: any) {
      console.error("Save profile error:", err);
      showMessage("✗ Save failed. Please try again.", "error");
    } finally {
      setIsSaving(false);
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
                    <span className="text-[var(--laser-green)] font-semibold">✓ Connected and Authenticated. Ready for profile updates.</span>
                  ) : (
                    <span>Firebase Auth and Storage are integrated. Use your roll number for instant offline access or backend-synced login.</span>
                  )}
                </p>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>

        {/* ─── Profile Editor (Only visible when logged in and active profile exists) ─── */}
        {currentUser && slug && (
          <ScrollReveal className="mt-8">
            <GlassCard hover={false} variant="featured" accent="amber">
              <div className="mb-6 border-b border-[var(--edge)] pb-4">
                <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Edit Profile & Custom Sections</h2>
                <p className="text-sm text-[var(--ceramic-muted)]">
                  Customize your synopsis, edit contact links, manage skills, list projects, and add unlimited custom profile sections.
                </p>
              </div>

              <div className="space-y-6">
                {/* Basic Info Row */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                      Personal Email
                    </label>
                    <input
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      className="input-metal"
                      placeholder="e.g. you@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="input-metal"
                      placeholder="e.g. https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                      Portfolio URL
                    </label>
                    <input
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className="input-metal"
                      placeholder="e.g. https://yourportfolio.me"
                    />
                  </div>
                </div>

                {/* Synopsis / Bio */}
                <div>
                  <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                    Synopsis / Short Biography
                  </label>
                  <textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="input-metal min-h-[100px] py-2"
                    placeholder="Write a brief overview of your academic focus, achievements, and research interests..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block font-data text-[11px] uppercase tracking-[0.14em] text-[var(--ceramic-muted)] mb-1.5">
                    Skills (Comma Separated)
                  </label>
                  <input
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="input-metal"
                    placeholder="e.g. Additive Manufacturing, Process planning, SolidWorks, Technical writing"
                  />
                  <span className="text-[10px] text-[var(--ceramic-muted)] mt-1 block">
                    Separate your skills with commas. They will automatically be displayed as tags on your profile.
                  </span>
                </div>

                {/* Projects Section */}
                <div>
                  <Divider className="my-5" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold text-[var(--ceramic)]">Demonstrated Projects</h3>
                    <button
                      type="button"
                      onClick={() => setProjects([...projects, { title: "", summary: "", status: "Ongoing" }])}
                      className="text-xs font-semibold text-[var(--arc-blue)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ＋ Add Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <GlassCard key={idx} variant="compact" className="relative p-4 border border-[var(--edge)] bg-[var(--void)]">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <span className="font-data text-[10px] uppercase text-[var(--ceramic-muted)]">Project #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                            className="text-xs font-semibold text-[var(--stress-red)] hover:underline cursor-pointer"
                          >
                            Remove Project
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 mb-3">
                          <div className="sm:col-span-2">
                            <label className="block font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">Project Title</label>
                            <input
                              value={project.title}
                              onChange={(e) =>
                                setProjects(projects.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p)))
                              }
                              className="input-metal"
                              placeholder="e.g. Design of Symmetric Mesh Structure"
                            />
                          </div>
                          <div>
                            <label className="block font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">Status</label>
                            <select
                              value={project.status}
                              onChange={(e) =>
                                setProjects(projects.map((p, i) => (i === idx ? { ...p, status: e.target.value } : p)))
                              }
                              className="input-metal bg-[var(--void-deep)]"
                            >
                              <option value="Concept">Concept</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">Summary</label>
                          <textarea
                            value={project.summary}
                            onChange={(e) =>
                              setProjects(projects.map((p, i) => (i === idx ? { ...p, summary: e.target.value } : p)))
                            }
                            className="input-metal min-h-[60px] py-1.5"
                            placeholder="Provide a brief summary of the project goals, processes used, and results obtained..."
                          />
                        </div>
                      </GlassCard>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-xs text-[var(--ceramic-muted)] italic select-none">No custom projects added yet.</p>
                    )}
                  </div>
                </div>

                {/* Custom Profile Sections */}
                <div>
                  <Divider className="my-5" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold text-[var(--ceramic)]">Custom Profile Sections</h3>
                    <button
                      type="button"
                      onClick={() => setProfileSections([...profileSections, { title: "", body: "" }])}
                      className="text-xs font-semibold text-[var(--arc-blue)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ＋ Add Custom Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {profileSections.map((section, idx) => (
                      <GlassCard key={idx} variant="compact" className="p-4 border border-[var(--edge)] bg-[var(--void)]">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <span className="font-data text-[10px] uppercase text-[var(--ceramic-muted)]">Custom Section #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setProfileSections(profileSections.filter((_, i) => i !== idx))}
                            className="text-xs font-semibold text-[var(--stress-red)] hover:underline cursor-pointer"
                          >
                            Remove Section
                          </button>
                        </div>

                        <div className="mb-3">
                          <label className="block font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">Section Title</label>
                          <input
                            value={section.title}
                            onChange={(e) =>
                              setProfileSections(
                                profileSections.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s))
                              )
                            }
                            className="input-metal"
                            placeholder="e.g. Publications, Academic Awards, Research Interests"
                          />
                         </div>

                         <div>
                           <label className="block font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1">Body Content</label>
                           <textarea
                             value={section.body}
                             onChange={(e) =>
                               setProfileSections(
                                 profileSections.map((s, i) => (i === idx ? { ...s, body: e.target.value } : s))
                               )
                             }
                             className="input-metal min-h-[100px] py-1.5"
                             placeholder="Enter section content here..."
                           />
                         </div>
                       </GlassCard>
                     ))}
                     {profileSections.length === 0 && (
                       <p className="text-xs text-[var(--ceramic-muted)] italic select-none">No custom sections added yet.</p>
                     )}
                   </div>
                 </div>

                 {/* Save Button */}
                 <div className="pt-4 border-t border-[var(--edge)] mt-6 flex justify-end">
                   <button
                     type="button"
                     onClick={saveProfile}
                     disabled={isSaving}
                     className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--forge-amber)] px-6 text-sm font-semibold text-white hover:brightness-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md"
                   >
                     {isSaving ? "Saving changes..." : "Save Profile Details"}
                   </button>
                 </div>
               </div>
             </GlassCard>
           </ScrollReveal>
         )}

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
