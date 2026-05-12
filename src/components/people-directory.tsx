"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { people, type Person, type PersonType } from "@/lib/data";
import { PersonCard, Portrait, ProfileActions } from "@/components/person-card";

const tabs: { label: string; value: PersonType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Faculty", value: "faculty" },
  { label: "M.Tech Students", value: "student" },
  { label: "PhD Scholars", value: "phd" },
];

const cohorts = ["All Batches", "2025-2027", "2024-2026", "2026-2028"];

export function PeopleDirectory() {
  const [type, setType] = useState<PersonType | "all">("all");
  const [cohort, setCohort] = useState("All Batches");
  const [preview, setPreview] = useState<Person | null>(null);

  const filtered = useMemo(
    () =>
      people.filter((person) => {
        const typeMatch = type === "all" || person.type === type;
        const cohortMatch = cohort === "All Batches" || person.cohort === cohort;
        return typeMatch && cohortMatch;
      }),
    [type, cohort],
  );

  return (
    <>
      <div className="border-y border-stone-300 bg-[#f3eee6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setType(tab.value)}
                className={[
                  "rounded-sm border px-3 py-2 text-sm font-semibold",
                  type === tab.value
                    ? "border-[#0b5d6b] bg-[#0b5d6b] text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-[#0b5d6b]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {cohorts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCohort(item)}
                className={[
                  "rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]",
                  cohort === item
                    ? "border-[#8c1515] bg-[#8c1515] text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-[#8c1515]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
          {filtered.length} profiles
        </p>
        <div className="grid gap-x-10 lg:grid-cols-2">
          {filtered.map((person) => (
            <PersonCard key={person.slug} person={person} onPreview={setPreview} />
          ))}
        </div>
      </section>
      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#172426]/70 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-sm bg-[#faf8f3] shadow-2xl">
            <div className="flex justify-end border-b border-stone-300 p-3">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="grid size-9 place-items-center rounded-sm border border-stone-300 bg-white text-stone-700 hover:border-[#8c1515]"
                aria-label="Close profile preview"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <div className="grid gap-6 p-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:p-6">
              <div className="w-fit max-w-full">
                <Portrait name={preview.name} large />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8c1515]">
                  {preview.batch ?? preview.type}
                </p>
                <h2 className="mt-2 overflow-wrap-anywhere font-serif text-3xl font-semibold leading-tight text-[#172426]">
                  {preview.name}
                </h2>
                <p className="mt-1 font-semibold text-[#0b5d6b]">{preview.role}</p>
                <p className="mt-4 leading-7 text-stone-700">{preview.synopsis}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {preview.skills.map((skill) => (
                    <span key={skill} className="rounded-sm border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700">
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
    </>
  );
}
