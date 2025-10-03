"use client";

import Calendar from "react-calendar";
import "~/styles/moodCalendar.css";
import Image from "next/image";
import { differenceInMonths, isSameDay, startOfMonth } from "date-fns";
import { useState } from "react";
import type { View } from "react-calendar/dist/shared/types.js";
import { useMonthlyMoodSummary } from "~/hooks/moodSummaryHooks";
import { useMoodEntryMutation } from "~/hooks/moodEntryHooks";
import { Button } from "~/components/ui/button";
import { MoodEntryCard } from "./moodEntryCard";

enum MoodCalendarViews {
  Calendar,
  Entries,
}

export function MoodCalendar() {
  const moodEntriesInDay = useMoodEntryMutation();
  const [view, setView] = useState<MoodCalendarViews>(
    MoodCalendarViews.Calendar,
  );
  const [monthOffset, setMonthOffset] = useState(0);
  const monthlyMoodSummary = useMonthlyMoodSummary(monthOffset);

  const getMoodEmojiSvgSrc = (date: Date): string | undefined => {
    const dateKey = date.toISOString().split("T")[0];
    if (!dateKey) return undefined;

    const dayNum = parseInt(dateKey?.substr(8, 9));
    if (!dayNum) return undefined;

    const avgMood = monthlyMoodSummary.data?.days[dayNum - 1]?.avgMood;
    if (!avgMood) return undefined;

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

    return undefined;
  };

  const NoEmojiTile = () => {
    return <div className="bg-accent h-[40px] w-[40px] rounded-full" />;
  };

  const emojiTileContent = ({ date, view }: { date: Date; view: View }) => {
    // Only render emojis on the month view
    if (view === "month") {
      const today = new Date();
      const isCurrentDay = isSameDay(date, today);
      const emojiSrc: string | undefined = getMoodEmojiSvgSrc(date);
      if (emojiSrc) {
        return (
          <Image
            priority
            loading="eager"
            src={emojiSrc}
            height={40}
            width={40}
            alt="mood emoji"
            className={`transition-opacity duration-500 ease-in-out ${
              isCurrentDay ? "rounded-full border-5 border-purple-400" : ""
            }`}
            style={{ opacity: 0 }}
            onLoadingComplete={(img) => {
              img.style.opacity = "1";
            }}
          />
        );
      } else {
        return <NoEmojiTile />;
      }
    }
  };

  return (
    <div>
      {view == MoodCalendarViews.Calendar ? (
        <Calendar
          activeStartDate={startOfMonth(
            new Date(new Date().setMonth(new Date().getMonth() - monthOffset)),
          )}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (!activeStartDate) return;
            const newOffset = differenceInMonths(
              startOfMonth(new Date()),
              startOfMonth(activeStartDate),
            );
            setMonthOffset(newOffset);
          }}
          className="p-4"
          tileClassName="rounded-lg"
          tileContent={
            monthlyMoodSummary.isSuccess ? emojiTileContent : NoEmojiTile
          }
          onClickDay={(day) => {
            moodEntriesInDay.mutate(day);
            setView(MoodCalendarViews.Entries);
          }}
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false}
        />
      ) : (
        <div>
          {view == MoodCalendarViews.Entries && (
            <Button onClick={() => setView(MoodCalendarViews.Calendar)}>
              Back
            </Button>
          )}

          {view == MoodCalendarViews.Entries &&
            moodEntriesInDay.data?.map((moodEntry) => {
              return (
                <MoodEntryCard
                  key={moodEntry.id}
                  date={moodEntry.timestamp}
                  journalEntry={moodEntry.journalEntry}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
