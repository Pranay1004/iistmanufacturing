import { PageFrame } from "@/components/site-shell";
import { curriculum, programHighlights } from "@/lib/data";

export default function AboutPage() {
  return (
    <PageFrame>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Program Overview</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight">
          M.Tech Manufacturing Technology under Aerospace Engineering at IIST.
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="border-t border-stone-300 pt-5">
            <h2 className="font-serif text-2xl font-semibold">Salient features</h2>
            <div className="mt-5 space-y-4">
              {programHighlights.map((item) => (
                <p key={item} className="border-t border-stone-300 pt-4 leading-7 text-stone-700">
                  {item}
                </p>
              ))}
            </div>
          </aside>
          <article className="space-y-6 text-lg leading-8 text-stone-700">
            <p>
              In line with national initiatives such as Make in India and Atmanirbhar Bharat,
              manufacturing technology is a key subject domain for building strong career prospects,
              strategic capability, and research capacity.
            </p>
            <p>
              The Manufacturing Technology master&apos;s program initiated by IIST under the Department
              of Aerospace Engineering is oriented toward advanced manufacturing processes for aerospace
              applications. It covers additive manufacturing and smart practices, composite manufacturing
              technology, deformation and joining processes, computer-aided subtractive manufacturing,
              manufacturing planning and control, and hands-on work with manufacturing, testing, and
              characterization equipment.
            </p>
            <p>
              The program is designed to develop creative and technologically competent human resources,
              while opening research avenues connected to ISRO centres, aerospace manufacturing case
              studies, space-oriented demonstrations, internships, and project opportunities.
            </p>
          </article>
        </div>
        <section className="mt-12 border-t border-stone-300 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">
            Curriculum effective from 2024 admission
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5 text-base leading-7 text-stone-700">
              <p>
                <strong className="text-[#172426]">Vision:</strong> {curriculum.vision}
              </p>
              <p>
                <strong className="text-[#172426]">Mission:</strong> {curriculum.mission}
              </p>
              <p>
                <strong className="text-[#172426]">Objective:</strong> {curriculum.objective}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {curriculum.semesters.map((semester) => (
                <article key={semester.title} className="border-t border-stone-300 pt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#8c1515]">
                    {semester.credits} credits
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold">{semester.title}</h2>
                  <div className="mt-3 space-y-2">
                    {semester.courses.map((course) => (
                      <p key={course} className="text-sm leading-6 text-stone-700">
                        {course}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-stone-300 pt-5">
            <h2 className="font-serif text-3xl font-semibold">Elective spread</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {curriculum.electives.map((elective) => (
                <span key={elective} className="rounded-sm border border-stone-300 bg-white px-2 py-1 text-sm">
                  {elective}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
