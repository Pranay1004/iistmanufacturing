import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { facilities, industrialVisits } from "@/lib/data";

export default function FacilitiesPage() {
  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ScrollReveal>
          <SectionLabel className="mb-3">Facilities</SectionLabel>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-[var(--ceramic)] sm:text-5xl">
            Labs, equipment culture, and ISRO exposure for manufacturing technology.
          </h1>
        </ScrollReveal>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {facilities.map((facility, i) => (
            <ScrollReveal key={facility.name} variant={i % 2 === 0 ? "left" : "right"}>
              <GlassCard className="h-full">
                <h2 className="font-display text-2xl font-bold text-[var(--ceramic)]">{facility.name}</h2>
                <p className="mt-3 leading-7 text-[var(--ceramic-muted)]">{facility.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {facility.capabilities.map((capability) => (
                    <span key={capability} className="rounded-md border border-[var(--edge)] bg-[var(--panel)] px-2 py-0.5 text-xs text-[var(--ceramic-muted)] transition-colors duration-200 hover:border-[var(--laser-green)] hover:text-[var(--laser-green)]">
                      {capability}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </section>

        <section className="mt-12 border-t border-[var(--edge)] pt-8">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-[var(--ceramic)]">
              Industrial and ISRO centre exposure
            </h2>
          </ScrollReveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {industrialVisits.map((centre) => (
              <ScrollReveal key={centre} variant="scale">
                <div className="glass surface-brushed rounded-lg px-4 py-6 text-center transition-all duration-300 hover:border-[var(--isro-saffron)] hover:shadow-[var(--shadow-glow-amber)]">
                  <p className="font-display text-xl font-bold text-[var(--isro-saffron)]">
                    {centre}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
