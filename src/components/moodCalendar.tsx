import Calendar from "react-calendar";
// import { useState } from "react";
import "~/styles/moodCalendar.css";
import Image from "next/image";
import { isSameDay } from "date-fns";
import type { ActivityTag } from "~/hooks/activityTagHooks";
import { apiFetch } from "~/lib/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";

interface MoodEntry {
  id: string;
  mood: string;
  color: string;
  journalEntry: string;
  timestamp: Date;
  activityTags: ActivityTag[];
}

function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

async function fetchMoodEntriesInDay(start: Date) {
  start.setHours(0, 0, 0, 0);
  const end: Date = new Date(start);
  end.setHours(23, 59, 59, 99);

  const startString = formatLocalDateTime(start);
  const endString = formatLocalDateTime(end);
  console.log(startString);
  // console.log(end.toISOString());
  return await apiFetch<MoodEntry[]>(
    `http://localhost:8080/api/mood-entries?start=${startString}&end=${endString}`,
  );
}

const useMoodEntryMutation = (
  setMoodEntries: Dispatch<SetStateAction<MoodEntry[]>>,
) =>
  useMutation({
    mutationFn: (start: Date) => fetchMoodEntriesInDay(start),
    onSuccess: (data) => {
      setMoodEntries(data);
    },
  });

// const fetchMoodEntriesI
// const useGetMoodEntry = () =>
//   useQuery: ["mood-entries"],
//   queryFn:

export function MoodCalendar() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const getMoodEntriesInDay = useMoodEntryMutation(setMoodEntries);

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
    <div>
      {moodEntries.length == 0 ? (
        <Calendar
          className="p-4"
          tileClassName="rounded-lg"
          tileContent={emojiTileContent}
          onClickDay={(day) => {
            getMoodEntriesInDay.mutate(day);
          }}
          prev2Label={null}
          next2Label={null}
        />
      ) : (
        <>
          {moodEntries.map((moodEntry) => (
            <Card key={moodEntry.id}>
              <CardTitle>{moodEntry.timestamp.getDate()}</CardTitle>
              <CardContent>{moodEntry.journalEntry}</CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
