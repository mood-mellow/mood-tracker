package com.moodtracker.backend.dto;

import java.util.List;
import java.util.Map;

public class MoodSummaryResponse {
	private String periodType;
    private int offSet;
	private double averageMood;
    private List<DaySummary> days;

    public MoodSummaryResponse(String periodType, int offSet, double averageMood, List<DaySummary> days) {
        this.periodType = periodType;
        this.offSet = offSet;
		this.averageMood = averageMood;
		this.days = days;
    }

	public String getPeriodType() { return periodType; }
    public int getOffSet() { return offSet; }
	public double getAverageMood() { return averageMood; }
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
