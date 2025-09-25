"use client";

import { MoodCalendar } from "~/components/moodCalendar";
import { Navbar01 as Navbar } from "~/components/ui/shadcn-io/navbar-01";

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center">
        <MoodCalendar />
      </main>
    </>
  );
}
