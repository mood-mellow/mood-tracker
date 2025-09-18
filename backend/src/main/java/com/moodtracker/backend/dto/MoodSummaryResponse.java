package com.moodtracker.backend.dto;

import java.util.List;
import java.util.Map;

public class MoodSummaryResponse {
	private int week;
	private double weeklyAvgMood;
	private List<Map.Entry<String, Integer>> mostCommonMoods;
	private List<Map.Entry<String, Integer>> mostCommonActivities;
    private List<DaySummary> days;

    public MoodSummaryResponse(int week, double weeklyAvgMood, List<Map.Entry<String, Integer>> mostCommonMoods, List<Map.Entry<String, Integer>> mostCommonActivities, List<DaySummary> days) {
        this.week = week;
		this.weeklyAvgMood = weeklyAvgMood;
		this.mostCommonMoods = mostCommonMoods;
		this.mostCommonActivities = mostCommonActivities;
		this.days = days;
    }

	public int getWeek() { return week; }
	public double getWeeklyAvgMood() { return weeklyAvgMood; }
	public List<Map.Entry<String, Integer>> getMostCommonMoods() { return mostCommonMoods; }
	public List<Map.Entry<String, Integer>> getMostCommonActivities() { return mostCommonActivities; }
    public List<DaySummary> getDays() { return days; }

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
