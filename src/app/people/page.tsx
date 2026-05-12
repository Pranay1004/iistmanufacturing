import { PeopleDirectory } from "@/components/people-directory";
import { PageFrame } from "@/components/site-shell";

export default function PeoplePage() {
  return (
    <PageFrame>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">People Directory</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Faculty, M.Tech scholars, and PhD researchers in one living academic profile system.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
            Click a card for a quick profile preview, then open the full profile page for projects,
            skills, contact details, and resume links when uploaded.
          </p>
        </section>
        <PeopleDirectory />
      </main>
    </PageFrame>
  );
}
