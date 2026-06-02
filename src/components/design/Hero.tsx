import { ArrowRight, Box, ChevronDown } from "lucide-react";
import { CanvasProvider } from "@/components/three/CanvasProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MetalButton } from "@/components/ui/MetalButton";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden py-12 lg:py-20 select-none bg-[var(--void)]">
      {/* Background blueprint details and radial lighting */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--arc-blue-dim)_0%,_transparent_75%)] opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 z-0 h-32 bg-gradient-to-t from-[var(--void)] to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Majestic text and interactive controls */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <SectionLabel color="blue" className="mb-6 w-fit animate-[fadeIn_0.5s_ease-out]">
              M.Tech Program · Department of Aerospace Engineering
            </SectionLabel>

            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-[var(--ceramic)] sm:text-5xl lg:text-6xl xl:text-7xl animate-[fadeIn_0.6s_ease-out]">
              Manufacturing{" "}
              <span className="gradient-shimmer">
                Technology
              </span>
              <br />
              <span className="text-[var(--ceramic-muted)] font-display">for aerospace</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--ceramic-muted)] sm:text-lg sm:leading-8 animate-[fadeIn_0.7s_ease-out]">
              A structured IIST academic directory for faculty, M.Tech scholars, PhD researchers,
              facilities, projects, skills, resumes, and industry-facing opportunities.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-[fadeIn_0.8s_ease-out]">
              <MetalButton href="/people" variant="primary">
                Explore Profiles
                <ArrowRight size={16} aria-hidden />
              </MetalButton>
              <MetalButton href="/about" variant="secondary">
                Program Overview
              </MetalButton>
            </div>
          </div>

          {/* Right Column: Premium metrology CAD simulation panel */}
          <div className="lg:col-span-6 w-full flex items-center justify-center animate-[fadeIn_0.9s_ease-out]">
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl border border-[var(--edge)] bg-[var(--panel)]/40 backdrop-blur-md shadow-card overflow-hidden flex flex-col surface-grid">
              
              {/* Metrology Frame Headers & Coordinate Notches */}
              <div className="absolute top-3 left-4 font-data text-[9px] uppercase tracking-wider text-[var(--ceramic-muted)]/60 z-10 flex items-center gap-1.5 select-none">
                <Box size={10} className="text-[var(--arc-blue)]" />
                <span>Sim: Bracket_v4.2.obj</span>
              </div>

              <div className="absolute top-3 right-4 font-data text-[9px] uppercase tracking-wider text-[var(--laser-green)] z-10 flex items-center gap-1 select-none font-bold">
                <span className="inline-block size-1.5 rounded-full bg-[var(--laser-green)] animate-ping" />
                <span>R3F: Active</span>
              </div>

              {/* Corner blueprints crosshairs (highly detailed CAD vibe) */}
              <div className="absolute top-2 left-2 size-3 border-t border-l border-[var(--ceramic-muted)]/30 z-10 pointer-events-none" />
              <div className="absolute top-2 right-2 size-3 border-t border-r border-[var(--ceramic-muted)]/30 z-10 pointer-events-none" />
              <div className="absolute bottom-2 left-2 size-3 border-b border-l border-[var(--ceramic-muted)]/30 z-10 pointer-events-none" />
              <div className="absolute bottom-2 right-2 size-3 border-b border-r border-[var(--ceramic-muted)]/30 z-10 pointer-events-none" />

              {/* The 3D Canvas itself inside interactive metrology card */}
              <div className="flex-1 w-full h-full relative z-0">
                <CanvasProvider className="h-full w-full" />
              </div>

              {/* Sub-metrology telemetries at bottom */}
              <div className="border-t border-[var(--edge)] bg-[var(--void)]/80 py-2.5 px-4 flex items-center justify-between font-data text-[9px] uppercase tracking-widest text-[var(--ceramic-muted)]/70 select-none z-10">
                <div className="flex items-center gap-4">
                  <span>SCALE: 1.18x</span>
                  <span>ROT: AUTO-Y</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-[var(--arc-blue)]">
                  <span>METROLOGY CONSOLE</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 scroll-indicator">
        <span className="font-data text-[9px] uppercase tracking-[0.2em] text-[var(--ceramic-muted)]">Scroll</span>
        <ChevronDown size={16} className="text-[var(--ceramic-muted)]" />
      </div>
    </section>
  );
}
