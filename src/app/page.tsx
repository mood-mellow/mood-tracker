import { Toaster } from "sonner";
import AuthPage from "./AuthPage";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center">
      <AuthPage />
      <Toaster position="top-right" richColors />
      {/* <Hero45 heading="The Mood Tracker built by REDACTED" /> */}
    </main>
  );
}
