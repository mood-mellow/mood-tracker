import { Hero45 } from "~/components/hero45";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center">
      <Button>Test</Button>
      <Hero45 heading="The Mood Tracker built by REDACTED" />
    </main>
  );
}
