import { PeopleDirectory } from "@/components/people-directory";
import { PageFrame } from "@/components/site-shell";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function PeoplePage() {
  return (
    <PageFrame>
      <main>
        <PeopleDirectory />
      </main>
    </PageFrame>
  );
}
