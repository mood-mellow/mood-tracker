import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/lib/apiClient";

export interface MoodSummary {
  days: [];
  mostCommonMoods: [];
  week: number;
  weeklyAvgMood: number;
}

const fetchMoodSummaryData = async () => {
  return await apiFetch("http://localhost:8080/mood-summary");
};

export const useMoodSummary = () => {
  return useQuery({
    queryKey: ["mood-summary"],
    queryFn: fetchMoodSummaryData,
  });
};
