import { apiFetch } from "~/lib/apiClient";
import z from "zod";

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
