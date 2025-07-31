import { Hero45 } from "~/components/hero45";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center">
      <Button loading={true}>Sign-in now</Button>
      <Hero45 heading="The Mood Tracker built by REDACTED" />
    </main>
  );
}
