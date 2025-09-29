package com.moodtracker.backend.repository;

import com.moodtracker.backend.model.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, String> {
    List<MoodEntry> findByUserIdAndTimestampBetween(
            String userId,
            Instant start,
            Instant end);

    List<MoodEntry> findByUserId(String userId);
}
