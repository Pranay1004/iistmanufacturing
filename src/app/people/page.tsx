import { PeopleDirectory } from "@/components/people-directory";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function PeoplePage() {
  return (
    <PageFrame>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <SectionLabel className="mb-3">People Directory</SectionLabel>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[var(--ceramic)] sm:text-4xl">
                M.Tech Scholars & PhD Researchers
              </h1>
              <p className="mt-4 text-base leading-7 text-[var(--ceramic-muted)] sm:text-lg">
                Academic directory arranged by cohort year. Select a profile card to view projects, research details, and upload credentials.
              </p>
            </ScrollReveal>
          </div>
        </section>
        <PeopleDirectory />
      </main>
    </PageFrame>
  );
}
