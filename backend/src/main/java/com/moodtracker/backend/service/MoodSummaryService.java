package com.moodtracker.backend.service;

import com.moodtracker.backend.dto.MoodSummaryResponse;
import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.repository.MoodEntryRepository;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
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

        return getSummaryForRange(userId, startDate, endDate, "weekly", weekOffset);
    }

    public MoodSummaryResponse getMonthlySummary(String userId, int monthOffset) {

        ZoneId zone = ZoneId.of("America/New_York");

        // monthOffset = 0 -> current month, 1 -> previous month, etc.
        LocalDate now = LocalDate.now(zone).minusMonths(monthOffset);

        // Start at first day of the month
        LocalDate startDate = now.withDayOfMonth(1);
        // End at last day of the month
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());

        return getSummaryForRange(userId, startDate, endDate, "monthly", monthOffset);
    }

    /*
     * Same as above but with explicit date range (inclusive).
     */
    public MoodSummaryResponse getSummaryForRange(
            String userId,
            LocalDate startDate,
            LocalDate endDate,
            String periodType,
            int offSet) {

        ZoneId zone = ZoneId.of("America/New_York");

        // Convert to DateTime bounds (inclusive and fixes earlier issue)
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59, 999_999_999);

        Instant startUtc = startDateTime.toInstant(ZoneOffset.UTC);
        Instant endUtc = endDateTime.toInstant(ZoneOffset.UTC);

        List<MoodEntry> entries = moodEntryRepository
                .findByUserIdAndTimestampBetween(userId, startUtc, endUtc);

        // Bucket entries by LocalDate
        Map<LocalDate, List<MoodEntry>> byDate = entries.stream()
            .collect(Collectors.groupingBy(e -> LocalDate.ofInstant(e.getTimestamp(), zone)));

        List<MoodSummaryResponse.DaySummary> days = new ArrayList<>();
        List<Integer> allScores = new ArrayList<>();
        HashMap<String, Integer> moodCounts = new HashMap<>();
        Map<String, Integer> activityCounts = new HashMap<>();

        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            List<MoodEntry> dayEntries = byDate.getOrDefault(d, Collections.emptyList());

            // increment each occuring mood by 1
            for (MoodEntry me : dayEntries) {
                String mood = me.getMood();
                mood = MoodSummaryService.normalizeMood(mood);
                moodCounts.merge(mood, 1, Integer::sum);
            }

            // Average mood via score mapping since it will be easier for AI insights
            List<Integer> dayScores = dayEntries.stream()
                    .map(MoodEntry::getMood)
                    .map(MoodSummaryService::normalizeMood)
                    .mapToInt(MoodSummaryService::scoreForMood) // returns 0 if unknown
                    .filter(score -> score > 0) // ignore unknown moods
                    .boxed()
                    .toList();

            // Weekly pool
            allScores.addAll(dayScores);

            double avgMood = dayScores.isEmpty() ? 0.0
                    : dayScores.stream().mapToInt(Integer::intValue).average().orElse(0.0);

            // Activity counts
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


        List<Map.Entry<String, Integer>> mostCommonActivities = new ArrayList<>(activityCounts.entrySet());
        mostCommonActivities.sort(Map.Entry.comparingByValue()); // asc order
        // keep only three most common moods
        while (mostCommonActivities.size() > 3) {
            mostCommonActivities.removeFirst();
        }

        List<Map.Entry<String, Integer>> mostCommonMoods = new ArrayList<>(moodCounts.entrySet());
        mostCommonMoods.sort(Map.Entry.comparingByValue()); // asc order
        // keep only three most common moods
        while (mostCommonMoods.size() > 3) {
            mostCommonMoods.removeFirst();
        }

        double averageMood = allScores.isEmpty() ? 0.0 : allScores.stream().mapToInt(Integer::intValue).average().orElse(0.0);

        return new MoodSummaryResponse(periodType, offSet, averageMood, mostCommonMoods, mostCommonActivities, days);
    }

    // Helpers to consider edge cases

    private static String normalizeMood(String mood) {
        if (mood == null)
            return "";
        return mood.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * Map mood strings to a 1-7 score.
     * Unknown moods return 0 (they're ignored in the average).
     * Adjust/extend as needed to match UX.
     */
    private static int scoreForMood(String normalizedMood) {
        switch (normalizedMood) {
            case "furious":
            case "annoyed":
            case "terrible":
			case "angry":
            case "frustrated":
            case "mad":
                return 1;
            case "fearful":
            case "anxious":
            case "uneasy":
            case "stressed":
            case "concerned":
                return 2;
            case "sad":
            case "down":
            case "unhappy":
            case "depressed":
            case "heartbroken":
            case "gloomy":
            case "hopeless":
                return 3;
            case "neutral":
            case "meh":
            case "okay":
            case "ok":
			case "bored":
            case "indifferent":
            case "composed":
            case "calm":
            case "balanced":
                return 4;
            case "good":
            case "content":
            case "fine":
            case "relaxed":
                return 5;
            case "great":
            case "awesome":
            case "joyful":
            case "appreciative":
            case "happy":
                return 6;
            case "loving":
            case "ecstatic":
            case "euphoric":
            case "elated":
                return 7;
            default:
                return 0; // unknown -> ignored
        }
    }
}
