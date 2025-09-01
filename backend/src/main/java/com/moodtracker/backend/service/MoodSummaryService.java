package com.moodtracker.backend.service;

import com.moodtracker.backend.dto.MoodSummaryResponse;
import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.repository.MoodEntryRepository;

import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MoodSummaryService {

    @Autowired
    private MoodEntryRepository moodEntryRepository;

    public MoodSummaryResponse getWeeklySummary(Long userId, LocalDate startOfWeek) {
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        // Fetch entries between startOfWeek and endOfWeek
        List<MoodEntry> entries = moodEntryRepository.findByUserIdAndTimestampBetween(userId, startOfWeek, endOfWeek);

        // Group by date
        Map<LocalDate, List<MoodEntry>> grouped = entries.stream()
                .collect(Collectors.groupingBy(MoodEntry::getDate));

        List<MoodSummaryResponse.DaySummary> summaries = grouped.entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<MoodEntry> dayEntries = entry.getValue();

                    double avgMood = dayEntries.stream()
                            .mapToInt(MoodEntry::getMoodValue)
                            .average()
                            .orElse(0);

                    Map<String, Integer> activityCounts = dayEntries.stream()
                            .flatMap(e -> e.getActivityTags().stream())
                            .collect(Collectors.toMap(
                                    ActivityTag::getName,
                                    tag -> 1,
                                    Integer::sum
                            ));

                    return new MoodSummaryResponse.DaySummary(
                            date.toString(),
                            avgMood,
                            activityCounts
                    );
                })
                .sorted(Comparator.comparing(MoodSummaryResponse.DaySummary::getDate))
                .toList();

        return new MoodSummaryResponse(summaries);
    }
}
