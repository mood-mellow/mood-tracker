package com.moodtracker.backend.dto;

import java.util.List;
import java.util.Map;

public class MoodSummaryResponse {
    private List<DaySummary> days;

    public MoodSummaryResponse(List<DaySummary> days) {
        this.days = days;
    }

    public List<DaySummary> getDays() {
        return days;
    }

    public static class DaySummary {
        private String date; // YYYY-MM-DD
        private double avgMood;
        private Map<String, Integer> activityCounts;

        public DaySummary(String date, double avgMood, Map<String, Integer> activityCounts) {
            this.date = date;
            this.avgMood = avgMood;
            this.activityCounts = activityCounts;
        }

        public String getDate() { return date; }
        public double getAvgMood() { return avgMood; }
        public Map<String, Integer> getActivityCounts() { return activityCounts; }
    }
}