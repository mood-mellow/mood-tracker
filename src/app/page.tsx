import { Toaster } from "sonner";
import { Hero45 } from "~/components/hero45";
import RegisterForm from "~/components/signup";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center">
      <RegisterForm />
      <Toaster position="top-right" richColors />
      {/* <Hero45 heading="The Mood Tracker built by REDACTED" /> */}
    </main>
  );
}
