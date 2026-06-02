"use client";

import { useState } from "react";
import { people } from "@/lib/data";
import { SectionLabel } from "@/components/ui/SectionLabel";

const categoryColors = {
  pg: "var(--forge-amber)",
  phd: "var(--laser-green)",
};

const publicPgCohorts = ["2024-2026", "2025-2027", "2026-2028"] as const;

function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<T, number>>(
    (acc, item) => ({
      ...acc,
      [item]: (acc[item] ?? 0) + 1,
    }),
    {} as Record<T, number>,
  );
}

export function PeopleOverview() {
  const [activeTelemetry, setActiveTelemetry] = useState<"pg" | "phd" | null>(null);

  const pg = people.filter(
    (person) => person.type === "student" && publicPgCohorts.includes(person.cohort as (typeof publicPgCohorts)[number]),
  );
  const phd = people.filter((person) => person.type === "phd");
  const total = pg.length + phd.length;

  const pgCohorts = publicPgCohorts.map((cohort) => ({
    label: cohort,
    value: pg.filter((person) => person.cohort === cohort).length,
  }));

  const phdYearCounts = countBy(phd.map((person) => person.admissionYear ?? "PhD"));
  const phdYears = Object.entries(phdYearCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([label, value]) => ({ label, value }));

  const pgPercentage = total > 0 ? (pg.length / total) * 100 : 0;
  const phdPercentage = total > 0 ? (phd.length / total) * 100 : 0;

  return (
    <aside className="people-chart-panel relative rounded-lg border border-[var(--edge)] bg-[var(--panel)]/88 p-5 shadow-[var(--shadow-md)] surface-brushed flex flex-col gap-6">
      <div className="w-full flex items-center justify-between">
        <SectionLabel color="amber">
          Intake Telemetry
        </SectionLabel>
        <span className="font-data text-[10px] uppercase tracking-[0.16em] text-[var(--ceramic-muted)] select-none">
          SYSTEM HEALTH: 100% ONLINE
        </span>
      </div>

      <div className="grid gap-5 w-full">
        {/* M.Tech Telemetry Indicator */}
        <div
          className={[
            "relative rounded-md border border-[var(--edge)] bg-[var(--void)] p-4 transition-all duration-300 cursor-help",
            activeTelemetry === "pg"
              ? "border-[var(--forge-amber)] shadow-[var(--shadow-glow-amber)] -translate-y-[2px]"
              : "hover:border-[var(--forge-amber)]/60",
          ].join(" ")}
          onMouseEnter={() => setActiveTelemetry("pg")}
          onMouseLeave={() => setActiveTelemetry(null)}
        >
          {/* Header section */}
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="font-data text-[10px] tracking-wider text-[var(--forge-amber)] uppercase font-semibold select-none">
                SYS-METRIC // M.TECH INTAKE
              </span>
              <p className="font-display text-2xl font-bold text-[var(--ceramic)] mt-0.5">
                {pg.length} <span className="text-xs font-normal text-[var(--ceramic-muted)]">students</span>
              </p>
            </div>
            <div className="text-right font-data text-xs font-semibold text-[var(--forge-amber)] select-none">
              {pgPercentage.toFixed(1)}% RATIO
            </div>
          </div>

          {/* Machined Segmented Bar Gauge */}
          <div className="relative w-full h-3.5 bg-[var(--carbon)] rounded overflow-hidden border border-[var(--edge)] flex p-[2px] gap-[2px]">
            {Array.from({ length: 20 }).map((_, idx) => {
              const isActive = (idx / 20) * 100 < pgPercentage;
              return (
                <div
                  key={idx}
                  className="flex-1 h-full rounded-[1px] transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? "var(--forge-amber)" : "var(--machined)",
                    opacity: isActive ? (activeTelemetry === "pg" ? 1 : 0.8) : 0.2,
                    boxShadow: isActive && activeTelemetry === "pg" ? "0 0 4px var(--forge-amber)" : undefined,
                  }}
                />
              );
            })}
          </div>

          {/* Telemetry mark ticks */}
          <div className="flex justify-between text-[8px] font-data text-[var(--ceramic-muted)]/50 mt-1 select-none">
            <span>0.0 // CAL</span>
            <span>0.5 // MID</span>
            <span>1.0 // MAX</span>
          </div>

          {/* Floating Hover Overlay breakdown inside the card container */}
          {activeTelemetry === "pg" && (
            <div className="absolute right-4 top-4 z-10 w-44 rounded border border-[var(--forge-amber)] bg-[var(--void-deep)]/95 backdrop-blur-md p-2.5 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <span className="block font-data text-[9px] font-bold text-[var(--forge-amber)] uppercase tracking-wider mb-1.5 select-none">
                COHORT BREAKDOWN
              </span>
              <div className="space-y-1">
                {pgCohorts.map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-[10px]">
                    <span className="font-data text-[var(--ceramic-muted)]">{row.label}</span>
                    <span className="font-bold text-[var(--ceramic)]">{row.value} candidates</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PhD Telemetry Indicator */}
        <div
          className={[
            "relative rounded-md border border-[var(--edge)] bg-[var(--void)] p-4 transition-all duration-300 cursor-help",
            activeTelemetry === "phd"
              ? "border-[var(--laser-green)] shadow-[0_0_12px_rgba(34,197,94,0.15)] -translate-y-[2px]"
              : "hover:border-[var(--laser-green)]/60",
          ].join(" ")}
          onMouseEnter={() => setActiveTelemetry("phd")}
          onMouseLeave={() => setActiveTelemetry(null)}
        >
          {/* Header section */}
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="font-data text-[10px] tracking-wider text-[var(--laser-green)] uppercase font-semibold select-none">
                SYS-METRIC // PHD INTAKE
              </span>
              <p className="font-display text-2xl font-bold text-[var(--ceramic)] mt-0.5">
                {phd.length} <span className="text-xs font-normal text-[var(--ceramic-muted)]">scholars</span>
              </p>
            </div>
            <div className="text-right font-data text-xs font-semibold text-[var(--laser-green)] select-none">
              {phdPercentage.toFixed(1)}% RATIO
            </div>
          </div>

          {/* Machined Segmented Bar Gauge */}
          <div className="relative w-full h-3.5 bg-[var(--carbon)] rounded overflow-hidden border border-[var(--edge)] flex p-[2px] gap-[2px]">
            {Array.from({ length: 20 }).map((_, idx) => {
              const isActive = (idx / 20) * 100 < phdPercentage;
              return (
                <div
                  key={idx}
                  className="flex-1 h-full rounded-[1px] transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? "var(--laser-green)" : "var(--machined)",
                    opacity: isActive ? (activeTelemetry === "phd" ? 1 : 0.8) : 0.2,
                    boxShadow: isActive && activeTelemetry === "phd" ? "0 0 4px var(--laser-green)" : undefined,
                  }}
                />
              );
            })}
          </div>

          {/* Telemetry mark ticks */}
          <div className="flex justify-between text-[8px] font-data text-[var(--ceramic-muted)]/50 mt-1 select-none">
            <span>0.0 // CAL</span>
            <span>0.5 // MID</span>
            <span>1.0 // MAX</span>
          </div>

          {/* Floating Hover Overlay breakdown inside the card container */}
          {activeTelemetry === "phd" && (
            <div className="absolute right-4 top-4 z-10 w-44 rounded border border-[var(--laser-green)] bg-[var(--void-deep)]/95 backdrop-blur-md p-2.5 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <span className="block font-data text-[9px] font-bold text-[var(--laser-green)] uppercase tracking-wider mb-1.5 select-none">
                ADMISSION BREAKDOWN
              </span>
              <div className="space-y-1">
                {phdYears.map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-[10px]">
                    <span className="font-data text-[var(--ceramic-muted)]">ADMIT-{row.label}</span>
                    <span className="font-bold text-[var(--ceramic)]">{row.value} candidates</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

