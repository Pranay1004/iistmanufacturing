"use client";

import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { people, type Person, type PersonType } from "@/lib/data";
import { PersonCard, Portrait, ProfileActions } from "@/components/person-card";

const tabs: { label: string; value: PersonType }[] = [
  { label: "M.Tech Students", value: "student" },
  { label: "PhD Scholars", value: "phd" },
];

const cohortsForType: Record<PersonType, string[]> = {
  faculty: [],
  student: ["2025-2027", "2024-2026", "2026-2028"],
  phd: ["2025", "2024", "2023", "2022", "2021"],
};

export function PeopleDirectory() {
  const [type, setType] = useState<PersonType>("student");
  const [cohort, setCohort] = useState("2025-2027");
  const [preview, setPreview] = useState<Person | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const filtered = useMemo(
    () =>
      people.filter((person) => {
        if (person.type !== type) return false;
        if (type === "student") return person.cohort === cohort;
        if (type === "phd") return person.admissionYear === cohort;
        return true;
      }),
    [type, cohort],
  );

  const availableCohorts = cohortsForType[type];

  // Reset pagination count on type or cohort change
  const handleTypeChange = (newType: PersonType) => {
    setType(newType);
    setCohort(cohortsForType[newType][0] ?? "");
    setVisibleCount(4);
  };

  const handleCohortChange = (newCohort: string) => {
    setCohort(newCohort);
    setVisibleCount(4);
  };

  // Auto scroll reveal mechanism
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Scrolled to 85% of the page
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        setVisibleCount((prev) => Math.min(prev + 4, filtered.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filtered.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Left Sidebar Control Console with Vertical Tabs */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          {/* Main Category Selector */}
          <div className="flex flex-col gap-2 rounded-lg border border-[var(--edge)] bg-[var(--panel)] p-3">
            <span className="font-data text-[10px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1 select-none">
              Category
            </span>
            <div className="flex flex-col gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTypeChange(tab.value)}
                  className={[
                    "w-full text-left rounded-md border px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between",
                    type === tab.value
                      ? "border-[var(--arc-blue)] bg-[var(--arc-blue)] text-white shadow-[var(--shadow-glow-blue)]"
                      : "border-[var(--edge)] bg-[var(--void)] text-[var(--ceramic-muted)] hover:border-[var(--arc-blue)] hover:text-[var(--ceramic)]",
                  ].join(" ")}
                >
                  <span>{tab.label}</span>
                  <span className={[
                    "text-xs px-2 py-0.5 rounded-full font-data",
                    type === tab.value ? "bg-white/20 text-white" : "bg-[var(--panel)] text-[var(--ceramic-muted)]",
                  ].join(" ")}>
                    {people.filter(p => p.type === tab.value).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cohort Year Selector */}
          {availableCohorts.length > 0 && (
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--edge)] bg-[var(--panel)] p-3">
              <span className="font-data text-[10px] uppercase tracking-wider text-[var(--ceramic-muted)] mb-1 select-none">
                Cohort Year
              </span>
              <div className="flex flex-row flex-wrap gap-1.5 lg:flex-col lg:flex-nowrap">
                {availableCohorts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleCohortChange(item)}
                    className={[
                      "w-fit lg:w-full text-left rounded-md border px-3 py-2 font-data text-xs uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer",
                      cohort === item
                        ? "border-[var(--forge-amber)] bg-[var(--forge-amber)] text-white shadow-[var(--shadow-glow-amber)]"
                        : "border-[var(--edge)] bg-[var(--void)] text-[var(--ceramic-muted)] hover:border-[var(--forge-amber)] hover:text-[var(--ceramic)]",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Column: Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Name Navigation Ribbon - Shows all names in a single horizontal scrolling row */}
          <div className="rounded-lg border border-[var(--edge)] bg-[var(--void-deep)]/40 p-4 overflow-hidden select-none">
            <span className="block font-data text-[9px] uppercase tracking-[0.16em] text-[var(--ceramic-muted)] mb-2.5">
              Quick Select ({filtered.length} Profiles)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filtered.map((person) => (
                <button
                  key={person.slug}
                  type="button"
                  onClick={() => setPreview(person)}
                  className={[
                    "w-full rounded border px-3 py-1.5 font-display text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 text-left justify-start min-w-0",
                    type === "student"
                      ? "border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic)] hover:border-[var(--forge-amber)] hover:shadow-[0_0_6px_rgba(245,158,11,0.2)]"
                      : "border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic)] hover:border-[var(--laser-green)] hover:shadow-[0_0_6px_rgba(34,197,94,0.2)]",
                  ].join(" ")}
                >
                  <span className={[
                    "size-1.5 rounded-full shrink-0 animate-pulse",
                    type === "student" ? "bg-[var(--forge-amber)]" : "bg-[var(--laser-green)]",
                  ].join(" ")} />
                  <span className="truncate">{person.name}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <span className="col-span-full text-xs text-[var(--ceramic-muted)] italic py-1 select-none">No active profiles in selected cohort.</span>
              )}
            </div>
          </div>

          {/* Directory Grid */}
          <section className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <p className="font-data text-xs uppercase tracking-[0.18em] text-[var(--ceramic-muted)] select-none">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} profiles
              </p>
              {visibleCount < filtered.length && (
                <span className="font-data text-[10px] text-[var(--arc-blue)] animate-pulse uppercase select-none">
                  ▼ Scroll to reveal more profiles
                </span>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.slice(0, visibleCount).map((person) => (
                <PersonCard key={person.slug} person={person} onPreview={setPreview} />
              ))}
            </div>

            {/* Load More Expander control */}
            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 4, filtered.length))}
                  className="rounded-md border border-[var(--edge)] bg-[var(--panel)] px-4 py-2 font-data text-xs uppercase tracking-wider text-[var(--ceramic-muted)] hover:border-[var(--arc-blue)] hover:text-[var(--arc-blue)] hover:shadow-[var(--shadow-glow-blue)] transition-all duration-200 cursor-pointer"
                >
                  Load More Profiles (+{filtered.length - visibleCount})
                </button>
              </div>
            )}
          </section>
        </div>

      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[var(--void)]/80 backdrop-blur-sm p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92svh] w-full max-w-4xl overflow-auto rounded-t-lg bg-[var(--void-deep)] border border-[var(--edge)] shadow-2xl sm:max-h-[90vh] sm:rounded-lg">
            <div className="sticky top-0 z-10 flex justify-end border-b border-[var(--edge)] bg-[var(--void-deep)]/95 backdrop-blur-sm p-3">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="grid size-9 place-items-center rounded-md border border-[var(--edge)] bg-[var(--panel)] text-[var(--ceramic-muted)] hover:border-[var(--stress-red)] hover:text-[var(--stress-red)] transition-colors duration-200 cursor-pointer"
                aria-label="Close profile preview"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:p-6 md:grid-cols-[176px_minmax(0,1fr)]">
              <div className="flex justify-center sm:justify-start sm:block">
                <Portrait name={preview.name} large />
              </div>
              <div className="min-w-0">
                <p className="font-data text-[11px] uppercase tracking-[0.18em] text-[var(--forge-amber)]">
                  {preview.batch ?? preview.type}
                </p>
                <h2 className="mt-2 overflow-wrap-anywhere font-display text-3xl font-bold leading-tight text-[var(--ceramic)] sm:text-4xl">
                  {preview.name}
                </h2>
                <p className="mt-1 font-medium text-[var(--arc-blue)]">{preview.role}</p>
                <p className="mt-4 leading-7 text-[var(--ceramic-muted)]">{preview.synopsis}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {preview.skills.map((skill) => (
                    <span key={skill} className="rounded-md border border-[var(--edge)] bg-[var(--panel)] px-2 py-0.5 text-xs text-[var(--ceramic-muted)]">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <ProfileActions person={preview} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
