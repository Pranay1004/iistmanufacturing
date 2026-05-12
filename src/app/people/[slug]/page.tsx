import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageFrame } from "@/components/site-shell";
import { Portrait, ProfileActions } from "@/components/person-card";
import { getPerson, people } from "@/lib/data";

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  return {
    title: person ? `${person.name} | Manufacturing Technology IIST` : "Profile",
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) {
    notFound();
  }

  return (
    <PageFrame>
      <main>
        <section className="border-b border-stone-300 bg-[#efe6d7]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/people" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8c1515]">
              <ArrowLeft size={16} aria-hidden />
              Back to directory
            </Link>
            <div className="mt-8 grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
              <div className="w-fit">
                <Portrait name={person.name} large />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">
                  {person.batch ?? person.type}
                </p>
                <h1 className="mt-3 overflow-wrap-anywhere font-serif text-4xl font-semibold leading-tight sm:text-5xl">{person.name}</h1>
                <p className="mt-2 text-base font-semibold text-[#0b5d6b] sm:text-lg">{person.role}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">{person.synopsis}</p>
                <div className="mt-6">
                  <ProfileActions person={person} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <aside className="space-y-7">
            <div className="border-t border-stone-300 pt-5">
              <h2 className="font-serif text-2xl font-semibold">Contact</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">Official</dt>
                  <dd className="mt-1 text-[#0b5d6b]">{person.officialEmail}</dd>
                </div>
                {person.personalEmail && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">Personal</dt>
                    <dd className="mt-1 text-stone-700">{person.personalEmail}</dd>
                  </div>
                )}
                {person.supervisor && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">Supervisor</dt>
                    <dd className="mt-1 text-stone-700">{person.supervisor}</dd>
                  </div>
                )}
                {person.admissionYear && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">Admission</dt>
                    <dd className="mt-1 text-stone-700">
                      {person.admissionYear}
                      {person.mode ? `, ${person.mode}` : ""}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="border-t border-stone-300 pt-5">
              <h2 className="font-serif text-2xl font-semibold">Seeking</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(person.seekingRoles ?? [person.availability]).map((role) => (
                  <span key={role} className="rounded-sm bg-[#f0dfc2] px-2 py-1 text-sm text-[#70420f]">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            {person.sourceUrl && (
              <div className="border-t border-stone-300 pt-5 text-sm leading-6 text-stone-600">
                Faculty seed data references the public IIST profile page. Members can refine this
                after claiming their dashboard profile.
              </div>
            )}
          </aside>

          <div className="space-y-10">
            <section className="border-t border-stone-300 pt-5">
              <h2 className="font-serif text-3xl font-semibold">Skills and expertise</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {Object.entries(person.skillGroups).map(([group, skills]) => (
                  <div key={group} className="border-t border-stone-300 pt-4">
                    <h3 className="font-semibold text-[#8c1515]">{group}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="rounded-sm border border-stone-300 bg-white px-2 py-1 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-stone-300 pt-5">
              <h2 className="font-serif text-3xl font-semibold">Demonstrated projects</h2>
              <div className="mt-5 space-y-4">
                {person.projects.length ? (
                  person.projects.map((project) => (
                    <article key={project.title} className="border-t border-stone-300 pt-4">
                      <p className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={17} className="text-[#0b5d6b]" aria-hidden />
                        {project.title}
                      </p>
                      <p className="mt-2 leading-7 text-stone-700">{project.summary}</p>
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-stone-500">{project.status}</p>
                    </article>
                  ))
                ) : (
                  <p className="leading-7 text-stone-700">Projects will appear here after the profile is claimed and updated.</p>
                )}
              </div>
            </section>

            {person.courses && (
              <section className="border-t border-stone-300 pt-5">
                <h2 className="font-serif text-3xl font-semibold">Courses and research areas</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {[...(person.researchInterests ?? []), ...person.courses].map((item) => (
                    <p key={item} className="border-l-2 border-[#b85c28] pl-3 leading-7 text-stone-700">
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
