package com.moodtracker.backend.service;

import com.moodtracker.backend.dto.MoodSummaryResponse;
import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.repository.MoodEntryRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MoodSummaryService {

    private final MoodEntryRepository moodEntryRepository;

    public MoodSummaryService(MoodEntryRepository moodEntryRepository) {
        this.moodEntryRepository = moodEntryRepository;
    }

    /*
     * Returns a 7-day summary ending "today - 7*weekOffset days".
     * weekOffset = 0 -> last 7 days ending today
     * weekOffset = 1 -> the preceding 7-day window, etc.
     */
    public MoodSummaryResponse getWeeklySummary(String userId, int weekOffset) {
        LocalDate endDate = LocalDate.now().minusWeeks(weekOffset); // inclusive
        LocalDate startDate = endDate.minusDays(6); // 7-day window

        return getSummaryForRange(userId, startDate, endDate, weekOffset);
    }

    /*
     * Same as above but with explicit date range (inclusive).
     */
    public MoodSummaryResponse getSummaryForRange(String userId, LocalDate startDate, LocalDate endDate,
            int weekOffset) {
        // Convert to DateTime bounds (inclusive and fixes earlier issue)
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59, 999_999_999);

        List<MoodEntry> entries = moodEntryRepository
                .findByUserIdAndTimestampBetween(userId, startDateTime, endDateTime);

        // Bucket entries by LocalDate
        Map<LocalDate, List<MoodEntry>> byDate = entries.stream()
                .collect(Collectors.groupingBy(e -> e.getTimestamp().toLocalDate()));

        List<MoodSummaryResponse.DaySummary> days = new ArrayList<>();
        List<Integer> allScores = new ArrayList<>();

        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            List<MoodEntry> dayEntries = byDate.getOrDefault(d, Collections.emptyList());

            // Average mood via score mapping since it will be easier for AI insights
            List<Integer> dayScores = dayEntries.stream()
                    .map(MoodEntry::getMood)
                    .map(MoodSummaryService::normalizeMood)
                    .mapToInt(MoodSummaryService::scoreForMood) // returns 0 if unknown
                    .filter(score -> score > 0) // ignore unknown moods
                    .boxed()
                    .collect(Collectors.toList());

            // Weekly pool
            allScores.addAll(dayScores);

            double avgMood = dayScores.isEmpty() ? 0.0
                    : dayScores.stream().mapToInt(Integer::intValue).average().orElse(0.0);

            // Activity counts
            Map<String, Integer> activityCounts = new HashMap<>();
            for (MoodEntry me : dayEntries) {
                List<ActivityTag> tags = me.getActivityTags();
                if (tags == null)
                    continue;
                for (ActivityTag tag : tags) {
                    String activityName = tag.getLabel();
                    if (activityName == null)
                        activityName = "unknown";
                    activityCounts.merge(activityName, 1, Integer::sum);
                }
            }

            days.add(new MoodSummaryResponse.DaySummary(
                    d.toString(), // YYYY-MM-DD
                    avgMood,
                    activityCounts));
        }

        double weeklyAvgMood = allScores.isEmpty() ? 0.0
                : allScores.stream().mapToInt(Integer::intValue).average().orElse(0.0);

        return new MoodSummaryResponse(weekOffset, weeklyAvgMood, days);
    }

    // Helpers to consider edge cases

    private static String normalizeMood(String mood) {
        if (mood == null)
            return "";
        return mood.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * Map mood strings to a 1-5 score.
     * Unknown moods return 0 (they're ignored in the average).
     * Adjust/extend as needed to match UX.
     */
    private static int scoreForMood(String normalizedMood) {
        switch (normalizedMood) {
            case "upset":
            case "awful":
            case "terrible":
            case "depressed":
            case "angry":
                return 1;
            case "sad":
            case "down":
            case "unhappy":
            case "mad":
                return 2;
            case "neutral":
            case "meh":
            case "okay":
            case "ok":
            case "bored":
                return 3;
            case "happy":
            case "good":
            case "content":
                return 4;
            case "great":
            case "awesome":
            case "ecstatic":
            case "joyful":
                return 5;
            default:
                return 0; // unknown -> ignored
        }
    }
}
