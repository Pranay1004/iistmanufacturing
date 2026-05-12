import { PeopleDirectory } from "@/components/people-directory";
import { PageFrame } from "@/components/site-shell";

export default function PeoplePage() {
  return (
    <PageFrame>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">People Directory</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight">
            Faculty, M.Tech scholars, and PhD researchers in one living academic profile system.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
            Click a card for a quick profile preview, then open the full profile page for projects,
            skills, contact details, and resume links when uploaded.
          </p>
        </section>
        <PeopleDirectory />
      </main>
    </PageFrame>
  );
}
