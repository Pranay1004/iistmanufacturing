import Link from "next/link";
import { GraduationCap, LogIn, Rocket } from "lucide-react";

const navItems = [
  ["About", "/about"],
  ["People", "/people"],
  ["Research", "/research"],
  ["Facilities", "/facilities"],
  ["Placements", "/placements"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-300 bg-[#faf8f3]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-[#0b5d6b] text-[#fff8eb]">
            <Rocket size={22} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#8c1515]">
              IIST Aerospace Engineering
            </span>
            <span className="block truncate font-serif text-lg font-semibold text-[#172426]">
              Manufacturing Technology
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[#8c1515]">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#0b5d6b] px-3 text-sm font-semibold text-[#0b5d6b] hover:bg-[#0b5d6b] hover:text-white"
        >
          <LogIn size={16} aria-hidden />
          Login
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-300 bg-[#172426] text-[#fff8eb]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <GraduationCap size={24} aria-hidden />
            <p className="font-serif text-xl">M.Tech Manufacturing Technology</p>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-stone-300">
            Department of Aerospace Engineering, Indian Institute of Space Science and Technology.
            Built as a living academic directory for faculty, students, PhD scholars, projects,
            skills, resumes, and industry-facing opportunities.
          </p>
        </div>
        <div className="text-sm leading-7 text-stone-300">
          <p className="font-semibold text-white">IIST, Valiamala</p>
          <p>Thiruvananthapuram, Kerala 695547</p>
          <p>Public profiles update through member login after approval.</p>
        </div>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#172426]">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
