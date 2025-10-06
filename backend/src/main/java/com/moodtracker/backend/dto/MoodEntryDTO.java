package com.moodtracker.backend.dto;

import java.time.Instant;

import com.moodtracker.backend.model.MoodEntry;

public class MoodEntryDTO {
    private String id;
    private String mood;
    private String color;
    private String emoji;
    private String journalEntry;
    private Instant timestamp;

    // Constructor that maps from entity to DTO without activityTags
    public MoodEntryDTO(MoodEntry entry) {
        this.id = entry.getId();
        this.mood = entry.getMood();
        this.journalEntry = entry.getJournalEntry();
        this.timestamp = entry.getTimestamp();
    }

    // --- Getters ---
    public String getId() { return id; }
    public String getMood() { return mood; }
    public String getColor() { return color; }
    public String getEmoji() { return emoji; }
    public String getJournalEntry() { return journalEntry; }
    public Instant getTimestamp() { return timestamp; }
}
