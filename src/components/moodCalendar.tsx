"use client";

import Calendar from "react-calendar";
import "~/styles/moodCalendar.css";
import Image from "next/image";
import { isSameDay } from "date-fns";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import type { View } from "react-calendar/dist/shared/types.js";
import { useMonthlyMoodSummary } from "~/hooks/moodSummaryHooks";
import { useMoodEntryMutation, type MoodEntry } from "~/hooks/moodEntryHooks";
import { Button } from "./ui/button";

enum MoodCalendarViews {
  Calendar,
  Entries,
}

export function MoodCalendar() {
  const moodEntriesInDay = useMoodEntryMutation();
  const monthlyMoodSummary = useMonthlyMoodSummary();
  const [view, setView] = useState<MoodCalendarViews>(
    MoodCalendarViews.Calendar,
  );

  const getMoodEmojiSvgSrc = (date: Date): string => {
    const dateKey = date.toISOString().split("T")[0];
    if (!dateKey) return "/emojis/unknown_face.svg";

    const dayNum = parseInt(dateKey?.substr(8, 9));
    if (!dayNum) return "/emojis/unknown_face.svg";

    const avgMood = monthlyMoodSummary.data?.days[dayNum - 1]?.avgMood;
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

  const emojiTileContent = ({ date, view }: { date: Date; view: View }) => {
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
      {view == MoodCalendarViews.Calendar && monthlyMoodSummary.isSuccess ? (
        <Calendar
          className="p-4"
          tileClassName="rounded-lg"
          tileContent={emojiTileContent}
          onClickDay={(day) => {
            moodEntriesInDay.mutate(day);
            setView(MoodCalendarViews.Entries);
          }}
          prev2Label={null}
          next2Label={null}
        />
      ) : (
        <div>
          <Button onClick={() => setView(MoodCalendarViews.Calendar)}>
            Back
          </Button>

          {view == MoodCalendarViews.Entries &&
            moodEntriesInDay.data?.map((moodEntry) => {
              const correctedDate = new Date(moodEntry.timestamp);

              const month = correctedDate.toLocaleString("en-US", {
                month: "long",
                timeZone: "America/New_York", // force Eastern Time
              });

              const day = correctedDate.toLocaleString("en-US", {
                day: "numeric",
                timeZone: "America/New_York",
              });

              const year = correctedDate.toLocaleString("en-US", {
                year: "numeric",
                timeZone: "America/New_York",
              });

              const time = correctedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "America/New_York",
              });

              return (
                <Card key={moodEntry.id} className="px-4">
                  <CardContent>
                    <CardTitle>
                      {month} {day}, {year}
                    </CardTitle>
                    <p>{time}</p>
                    <b>Note: </b>
                    {moodEntry.journalEntry}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
