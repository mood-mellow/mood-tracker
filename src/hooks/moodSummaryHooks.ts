import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/lib/apiClient";

export interface MoodSummary {
  week: number;
  weeklyAvgMood: number;
  mostCommonMoods: Array<Record<string, number>>;
  mostCommonActivities: Array<Record<string, number>>;
  days: DayEntry[];
}

export interface DayEntry {
  date: string; // ISO date string
  avgMood: number;
  activityCounts: Record<string, number>;
}

const fetchMoodSummaryData = async (): Promise<MoodSummary> => {
  return await apiFetch<MoodSummary>("http://localhost:8080/mood-summary");
};

export const useMoodSummary = () => {
  return useQuery({
    queryKey: ["mood-summary"],
    queryFn: fetchMoodSummaryData,
  });
};
