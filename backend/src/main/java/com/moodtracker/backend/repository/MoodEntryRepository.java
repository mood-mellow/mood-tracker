package com.moodtracker.backend.repository;

import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    List<MoodEntry> findByUserIdAndTimestampBetween(
        String userId,
        LocalDateTime start,
        LocalDateTime end
    );
}

