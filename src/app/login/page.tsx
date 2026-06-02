import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Upload, UserRoundCheck } from "lucide-react";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";

export default function LoginPage() {
  const loginFeatures: [LucideIcon, string, string][] = [
    [UserRoundCheck, "Member ownership", "Each student, faculty member, or PhD scholar edits only their own profile."],
    [Upload, "PDF and photo uploads", "Resumes stay hidden until a member uploads one through Firebase Storage."],
    [ShieldCheck, "Approval workflow", "Pranay can administer; Dr. Sooraj V. S can approve profile publication."],
  ];

  return (
    <PageFrame>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ScrollReveal>
          <SectionLabel className="mb-3">Member Login</SectionLabel>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
            Claim your profile, keep it current, and publish only approved updates.
          </h1>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <ScrollReveal variant="left" as="section">
            <GlassCard hover={false}>
              <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">Firebase auth scaffold</h2>
              <p className="mt-4 leading-7 text-[var(--ceramic-muted)]">
                The site is ready for a new Firebase project using Google sign-in, Firestore profile data,
                and Firebase Storage for profile photos and PDF resumes. Add the Vercel environment
                variables, enable Google Auth, and this page can be wired to the live provider.
              </p>
              <div className="mt-6">
                <MetalButton href="/dashboard">
                  Open dashboard preview
                </MetalButton>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal variant="right" as="section">
            <div className="space-y-4">
              {loginFeatures.map(([Icon, title, text]) => (
                <GlassCard key={title}>
                  <div className="mb-3 grid size-9 place-items-center rounded-md bg-[var(--forge-amber-dim)]">
                    <Icon size={18} className="text-[var(--forge-amber)]" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[var(--ceramic)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--ceramic-muted)]">{text}</p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </main>
    </PageFrame>
  );
}
