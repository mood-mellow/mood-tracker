package com.moodtracker.backend.service;

import com.example.moodtracker.model.MoodEntry;
import com.example.moodtracker.repository.MoodEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MoodEntryService {
    private final MoodEntryRepository moodEntryRepository;

    public MoodEntryService(MoodEntryRepository moodEntryRepository) {
        this.moodEntryRepository = moodEntryRepository;
    }

    public List<MoodEntry> getMoodEntriesForUser(Long userId, LocalDate day) {
		LocalDateTime startOfDay = day.atStartOfDay();
		LocalDateTime endOfDay = day.atTime(23, 59, 59);
        return moodEntryRepository.findByUserIdAndTimestampBetween(userId, startOfDay, endOfDay);
    }
}
