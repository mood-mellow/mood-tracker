import Calendar from "react-calendar";
import { useState } from "react";
import "~/styles/moodCalendar.css";
import Image from "next/image";
import { isSameDay } from "date-fns";

export function MoodCalendar() {
  const [date, setDate] = useState(new Date());

  const dailyMoods: Record<string, number> = {
    "2025-09-05": 5,
    "2025-09-10": 4,
    "2025-09-15": 3,
  };

  const getMoodEmojiSvgSrc = (date: Date): string => {
    const dateKey = date.toISOString().split("T")[0];
    if (!dateKey) return "/emojis/unknown_face.svg";

    const avgMood: number = dailyMoods[dateKey];
    if (!avgMood) return "/emojis/unknown_face.svg";

    if (avgMood <= 1) {
      return "/emojis/pouting_face.svg";
    } else if (avgMood <= 2) {
      return "/emojis/worried_face.svg";
    } else if (avgMood <= 3) {
      return "/emojis/slightly_frowning_face.svg";
    } else if (avgMood <= 4) {
      return "/emojis/neutral_face.svg";
    } else if (avgMood <= 5) {
      return "/emojis/slightly_smiling_face.svg";
    } else if (avgMood <= 6) {
      return "/emojis/smiling_face_smiling_eyes.svg";
    } else if (avgMood <= 7) {
      return "/emojis/smiling_face_hearts.svg";
    }

    return "/emojis/unknown_face.svg";
  };

  const emojiTileContent = ({ date, view }) => {
    // Only render emojis on the month view
    if (view === "month") {
      const today = new Date();
      const isCurrentDay = isSameDay(date, today);
      const emojiSrc: string = getMoodEmojiSvgSrc(date);
      if (emojiSrc) {
        return (
          <Image
            src={emojiSrc}
            height={40}
            width={40}
            alt="test"
            className={
              isCurrentDay ? "rounded-full border-5 border-purple-400" : ""
            }
          />
        );
      }
    }
  };

  return (
    <>
      <Calendar
        className="p-4"
        tileClassName="rounded-lg"
        tileContent={emojiTileContent}
        prev2Label={null}
        next2Label={null}
      />
    </>
  );
}
