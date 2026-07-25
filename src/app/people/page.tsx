import { PeopleDirectory } from "@/components/people-directory";
import { PageFrame } from "@/components/site-shell";

export default function PeoplePage() {
  return (
    <PageFrame>
      <main>
        <PeopleDirectory />
      </main>
    </PageFrame>
  );
}
