import { Toaster } from "sonner";
import { Hero45 } from "~/components/hero45";
import RegisterPreview from "~/components/signup";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center">
      <RegisterPreview />
      <Toaster position="top-right" richColors />
      {/* <Hero45 heading="The Mood Tracker built by REDACTED" /> */}
    </main>
  );
}
