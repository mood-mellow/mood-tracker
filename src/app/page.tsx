import Link from "next/link";
import { Toaster } from "sonner";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center">
      <Link href={"/login"}>Go to Login/Signup</Link>
      <Toaster position="top-right" richColors />
    </main>
  );
}
