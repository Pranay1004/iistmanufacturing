import { Save, Upload } from "lucide-react";
import { PageFrame } from "@/components/site-shell";
import { getPerson } from "@/lib/data";

export default function DashboardPage() {
  const pranay = getPerson("pranay-kumar-pandey");

  return (
    <PageFrame>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8c1515]">Dashboard Preview</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight">
          Profile editor layout for member-owned updates.
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-stone-700">
          This is the UI shell for the authenticated dashboard. Once Firebase keys are added, fields
          can read and write from Firestore, while photo and resume uploads go to Firebase Storage.
        </p>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="border-t border-stone-300 pt-5">
            <h2 className="font-serif text-3xl font-semibold">{pranay?.name}</h2>
            <p className="mt-2 font-semibold text-[#0b5d6b]">{pranay?.role}</p>
            <div className="mt-5 space-y-3 text-sm text-stone-700">
              <p>Admin: Pranay</p>
              <p>Approver: Dr. Sooraj V. S</p>
              <p>Resume button stays hidden until PDF upload is present.</p>
            </div>
          </aside>
          <form className="grid gap-5 border-t border-stone-300 pt-5">
            {[
              ["Display name", pranay?.name ?? ""],
              ["Specialization", pranay?.specialization ?? ""],
              ["Official email", pranay?.officialEmail ?? ""],
              ["Personal email", pranay?.personalEmail ?? ""],
              ["Portfolio", pranay?.portfolio ?? ""],
            ].map(([label, value]) => (
              <label key={label} className="grid gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">{label}</span>
                <input
                  defaultValue={value}
                  className="h-11 rounded-sm border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#0b5d6b]"
                />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">Synopsis</span>
              <textarea
                defaultValue={pranay?.synopsis}
                rows={5}
                className="rounded-sm border border-stone-300 bg-white p-3 text-sm leading-6 outline-none focus:border-[#0b5d6b]"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-sm border border-stone-300 bg-white px-4 text-sm font-semibold">
                <Upload size={16} aria-hidden />
                Upload Photo
              </button>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-sm border border-stone-300 bg-white px-4 text-sm font-semibold">
                <Upload size={16} aria-hidden />
                Upload Resume PDF
              </button>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-sm bg-[#8c1515] px-4 text-sm font-semibold text-white">
                <Save size={16} aria-hidden />
                Save Draft
              </button>
            </div>
          </form>
        </section>
      </main>
    </PageFrame>
  );
}
