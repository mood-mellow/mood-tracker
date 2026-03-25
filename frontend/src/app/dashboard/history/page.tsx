"use client";

import { useEffect, useState } from "react";
import { MoodCalendar } from "~/components/moodCalendar";
import { Navbar01 as Navbar } from "~/components/ui/shadcn-io/navbar-01";

export default function HistoryPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = 1 + 7; // background + 7 emoji svgs
    const handleLoad = () => {
      loaded++;
      if (loaded >= total) setIsReady(true);
    };

    // preload background
    const bg = new Image();
    bg.src = "/bbblurry.svg";
    bg.onload = handleLoad;

    // preload emojis
    [
      "/emojis/pouting_face.svg",
      "/emojis/worried_face.svg",
      "/emojis/slightly_frowning_face.svg",
      "/emojis/neutral_face.svg",
      "/emojis/slightly_smiling_face.svg",
      "/emojis/smiling_face_smiling_eyes.svg",
      "/emojis/smiling_face_hearts.svg",
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
    });
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
        {isReady ? <MoodCalendar /> : <div className="text-lg">Loading…</div>}
      </main>
    </>
  );
}
