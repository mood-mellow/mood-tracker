package com.moodtracker.backend.service;

import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class MoodEntryService {
    private final MoodEntryRepository moodEntryRepository;

    public MoodEntryService(MoodEntryRepository moodEntryRepository) {
        this.moodEntryRepository = moodEntryRepository;
    }

    public List<MoodEntry> getMoodEntriesForUser(String userId, LocalDate day) {
        LocalDateTime startOfDay = day.atStartOfDay();
        LocalDateTime endOfDay = day.atTime(23, 59, 59);

        Instant startUtc = startOfDay.toInstant(ZoneOffset.UTC);
        Instant endUtc = endOfDay.toInstant(ZoneOffset.UTC);

        return moodEntryRepository.findByUserIdAndTimestampBetween(userId, startUtc, endUtc);
    }
}
