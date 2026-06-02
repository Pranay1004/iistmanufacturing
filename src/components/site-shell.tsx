"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, LogIn, Menu, Rocket, X } from "lucide-react";

const navItems = [
  ["About", "/about"],
  ["People", "/people"],
  ["Faculty", "/faculty"],
  ["Research", "/research"],
  ["Facilities", "/facilities"],
  ["Media", "/media"],
  ["Placements", "/placements"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Slim Sidebar (lg and up) - Rotated Vertical Text Navigation */}
      <aside className="hidden lg:flex w-20 shrink-0 border-r border-[var(--edge)] bg-[var(--panel)] h-screen sticky top-0 flex-col justify-between z-40 shadow-sm select-none">
        
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          {/* Logo Badge at the absolute top */}
          <Link 
            href="/" 
            className="h-20 w-full flex items-center justify-center bg-gradient-to-br from-[var(--arc-blue)] to-[var(--cool-zone)] text-white hover:brightness-110 transition-all select-none border-b border-[var(--edge)] relative shrink-0"
            aria-label="Department Home"
          >
            <div className="absolute top-1 left-1 size-1 border-t border-l border-white/50" />
            <div className="absolute top-1 right-1 size-1 border-t border-r border-white/50" />
            <div className="absolute bottom-1 left-1 size-1 border-b border-l border-white/50" />
            <div className="absolute bottom-1 right-1 size-1 border-b border-r border-white/50" />
            <Rocket size={20} aria-hidden />
          </Link>

          {/* Navigation Links - Stacked vertically with rotated text, scrollable if viewport overflows */}
          <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col w-full">
            {navItems.map(([label, href]) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "group relative w-full h-24 flex items-center justify-center border-b border-[var(--edge)] transition-all duration-300 cursor-pointer select-none shrink-0",
                    isActive
                      ? "bg-white text-[var(--ceramic)] border-l-[6px] border-[var(--forge-amber)] shadow-sm font-bold"
                      : "bg-transparent text-[var(--ceramic-muted)] hover:text-[var(--ceramic)] hover:bg-[var(--panel)]",
                  ].join(" ")}
                >
                  <span 
                    className="font-display text-xs uppercase tracking-[0.16em] text-center whitespace-nowrap transition-colors duration-200"
                    style={{ 
                      writingMode: "vertical-rl", 
                      transform: "rotate(180deg)" 
                    }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Login Action inside Sidebar */}
        <Link
          href="/login"
          className={[
            "group relative w-full h-20 flex flex-col items-center justify-center transition-all duration-300 border-t border-[var(--edge)] cursor-pointer select-none shrink-0",
            pathname === "/login"
              ? "bg-white text-[var(--arc-blue)] border-l-[6px] border-[var(--arc-blue)]"
              : "bg-transparent text-[var(--ceramic-muted)] hover:text-[var(--arc-blue)] hover:bg-[var(--panel)]",
          ].join(" ")}
          aria-label="Login Portal"
        >
          <LogIn size={18} className="mb-1 transition-colors duration-200" aria-hidden />
          <span className="font-data text-[8px] uppercase tracking-wider select-none font-bold">
            Login
          </span>
        </Link>
      </aside>

      {/* Mobile Top Bar (collapsed on desktop, visible on mobile) */}
      <header className="lg:hidden sticky top-0 z-40 border-b border-[var(--edge)] bg-[var(--void)]/85 backdrop-blur-md py-3 px-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded bg-gradient-to-br from-[var(--arc-blue)] to-[var(--cool-zone)] text-white">
            <Rocket size={16} aria-hidden />
          </span>
          <span className="font-display text-sm font-bold text-[var(--ceramic)]">
            Manufacturing Tech
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="p-2 rounded border border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic-muted)] hover:text-[var(--arc-blue)]"
          >
            <LogIn size={14} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid size-9 place-items-center rounded border border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic-muted)] hover:text-[var(--ceramic)] cursor-pointer"
          >
            {mobileOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <nav className="lg:hidden fixed inset-x-0 top-[53px] bottom-0 z-35 bg-[var(--void)]/95 backdrop-blur-xl px-6 py-8 flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
          <span className="font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)]/60 select-none">
            Navigation Console
          </span>
          <div className="flex flex-col gap-2">
            {navItems.map(([label, href]) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "w-full rounded-md border px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-between",
                    isActive
                      ? "text-[var(--arc-blue)] bg-[var(--arc-blue-dim)] border-[var(--edge-active)]/30"
                      : "border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic-muted)] hover:text-[var(--ceramic)]",
                  ].join(" ")}
                >
                  <span>{label}</span>
                  {isActive && <span className="size-1.5 rounded-full bg-[var(--arc-blue)]" />}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--edge)] bg-[var(--void-deep)] surface-grid">
      {/* Subtle gradient overlay at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--arc-blue-dim)] to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-[var(--arc-blue-dim)] text-[var(--arc-blue)]">
              <GraduationCap size={20} aria-hidden />
            </span>
            <p className="font-display text-lg font-semibold text-[var(--ceramic)]">
              M.Tech Manufacturing Technology
            </p>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--ceramic-muted)]">
            Department of Aerospace Engineering, Indian Institute of Space Science and Technology.
            Built as a living academic directory for faculty, students, PhD scholars, projects,
            skills, resumes, and industry-facing opportunities.
          </p>
        </div>
        <div className="text-sm leading-7 text-[var(--ceramic-muted)]">
          <p className="font-medium text-[var(--ceramic)]">IIST, Valiamala</p>
          <p>Thiruvananthapuram, Kerala 695547</p>
          <p className="mt-3 font-data text-[10px] uppercase tracking-[0.18em] text-[var(--arc-blue)]">
            Machined at IIST
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--void)] text-[var(--ceramic)] flex flex-col lg:flex-row">
      {/* Left Sidebar Navigation */}
      <SiteHeader />
      
      {/* Main scrollable body on the right */}
      <div className="flex-1 min-w-0 flex flex-col justify-between min-h-screen">
        <div>{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
