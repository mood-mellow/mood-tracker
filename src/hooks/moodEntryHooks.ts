import { apiFetch } from "~/lib/apiClient";
import z from "zod";
import type { ActivityTag } from "~/hooks/activityTagHooks";
import { fromZonedTime } from "date-fns-tz";
import { useMutation } from "@tanstack/react-query";

export interface MoodEntry {
  id: string;
  mood: string;
  color: string;
  journalEntry: string;
  timestamp: Date;
  activityTags: ActivityTag[];
}

export const moodEntryFormSchema = z.object({
  mood: z.string().min(1, { message: "Please select a mood" }),
  emoji: z.string().min(1, { message: "Please select an emoji" }),
  journal: z
    .string()
    .min(1, { message: "Please write something in your journal" }),
  activityTagIds: z
    .string()
    .array()
    .min(1, { message: "Please select an activity" }),
  color: z.string().min(1, { message: "Please select a color" }),
});

export const createMoodEntry = async (
  data: z.infer<typeof moodEntryFormSchema>,
): Promise<z.infer<typeof moodEntryFormSchema>> => {
  return await apiFetch<z.infer<typeof moodEntryFormSchema>>(
    "http://localhost:8080/api/mood-entries",
    {
      method: "POST",
      body: JSON.stringify({
        journalEntry: data.journal,
        mood: data.mood,
        emoji: data.emoji,
        color: data.color,
        activityTagIds: data.activityTagIds,
      }),
    },
  );
};

const targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function getDayRangeInUTC(date: Date, timeZone: string) {
  // Get the local date parts in the target timezone
  const localStart = new Date(date);
  localStart.setHours(0, 0, 0, 0);

  const localEnd = new Date(date);
  localEnd.setHours(23, 59, 59, 999);

  // Convert those "wall times" in that timezone to UTC
  const startUtc = fromZonedTime(localStart, timeZone);
  const endUtc = fromZonedTime(localEnd, timeZone);

  return { startUtc, endUtc };
}

async function fetchMoodEntriesInDay(date: Date, timeZone: string) {
  const { startUtc, endUtc } = getDayRangeInUTC(date, timeZone);

  return await apiFetch<MoodEntry[]>(
    `http://localhost:8080/api/mood-entries?start=${startUtc.toISOString()}&end=${endUtc.toISOString()}`,
  );
}

export const useMoodEntryMutation = () =>
  useMutation({
    mutationFn: (start: Date) => fetchMoodEntriesInDay(start, targetTimeZone),
    // onSuccess: (data) => {},
  });
