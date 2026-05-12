import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Upload, UserRoundCheck } from "lucide-react";
import { PageFrame } from "@/components/site-shell";

export default function LoginPage() {
  const loginFeatures: [LucideIcon, string, string][] = [
    [UserRoundCheck, "Member ownership", "Each student, faculty member, or PhD scholar edits only their own profile."],
    [Upload, "PDF and photo uploads", "Resumes stay hidden until a member uploads one through Firebase Storage."],
    [ShieldCheck, "Approval workflow", "Pranay can administer; Dr. Sooraj V. S can approve profile publication."],
  ];

  return (
    <PageFrame>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Member Login</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          Claim your profile, keep it current, and publish only approved updates.
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <section className="border-t border-stone-300 pt-6">
            <h2 className="font-serif text-3xl font-semibold">Firebase auth scaffold</h2>
            <p className="mt-4 leading-7 text-stone-700">
              The site is ready for a new Firebase project using Google sign-in, Firestore profile data,
              and Firebase Storage for profile photos and PDF resumes. Add the Vercel environment
              variables, enable Google Auth, and this page can be wired to the live provider.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex h-11 items-center rounded-sm bg-[#0b5d6b] px-4 text-sm font-semibold text-white hover:bg-[#084854]"
            >
              Open dashboard preview
            </Link>
          </section>
          <section className="space-y-4">
            {loginFeatures.map(([Icon, title, text]) => (
              <article key={title} className="border-t border-stone-300 pt-4">
                <Icon size={22} className="text-[#b85c28]" aria-hidden />
                <h3 className="mt-3 font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </PageFrame>
  );
}
