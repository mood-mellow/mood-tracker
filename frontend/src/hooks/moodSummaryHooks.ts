import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/lib/apiClient";

const localTimezoneId = encodeURIComponent(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);

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
  return await apiFetch<MoodSummary>(
    `http://localhost:8080/mood-summary/weekly?zone=${localTimezoneId}`,
  );
};

const fetchMonthlyMoodSummaryData = async (
  offset = 0,
): Promise<MoodSummary> => {
  return await apiFetch<MoodSummary>(
    `http://localhost:8080/mood-summary/monthly?offSet=${offset}&zone=${localTimezoneId}`,
  );
};

export const useMoodSummary = () => {
  return useQuery({
    queryKey: ["mood-summary"],
    queryFn: fetchMoodSummaryData,
  });
};

export const useMonthlyMoodSummary = (offset: number) => {
  return useQuery({
    queryKey: ["monthly-mood-summary", offset],
    queryFn: () => fetchMonthlyMoodSummaryData(offset),
  });
};
