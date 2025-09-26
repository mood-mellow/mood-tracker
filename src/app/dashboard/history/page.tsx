"use client";

import { useEffect, useState } from "react";
import { MoodCalendar } from "~/components/moodCalendar";
import { Navbar01 as Navbar } from "~/components/ui/shadcn-io/navbar-01";

export default function HistoryPage() {
  const [isReady, setIsReady] = useState(false);

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = "/bbblurry.svg";
    img.onload = () => setIsReady(true);
  }, []);
  return (
    <>
      <Navbar />
      <main
        className={`flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4 transition-opacity duration-700 md:p-8 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url(/bbblurry.svg)" }}
      >
        <MoodCalendar />
      </main>
    </>
  );
}
