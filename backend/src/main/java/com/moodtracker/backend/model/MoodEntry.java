package com.moodtracker.backend.model;

import jakarta.persistence.*; // For @Entity, @Id, etc.

import java.time.Instant;
import java.util.List; // For List

@Entity
@Table(name = "mood_entries") // Or whatever is the table name for the mood entries
public class MoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String mood; // e.g., "happy", "sad", "neutral"

    // Link to User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Journal entry text
    @Column(length = 2000)
    private String journalEntry;

    // List of activities for the mood entry
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "mood_entry_activities", // Changed from mood_entry_activity_tag to mood_entry_activities
            joinColumns = @JoinColumn(name = "mood_entry_id"), inverseJoinColumns = @JoinColumn(name = "activity_tag_id"))
    private List<ActivityTag> activityTags;

    // Timestamp when mood entry was created (if we plan on using this)
    @Column(nullable = false)
    private Instant timestamp;

    // --- Constructors ---

    public MoodEntry() {
        // JPA requires a default constructor
    }

    public MoodEntry(Instant timestamp, String mood, User user, List<ActivityTag> activityTags,
                     String journalEntry) {
        this.timestamp = timestamp;
        this.mood = mood;
        this.user = user;
        this.activityTags = activityTags;
        this.journalEntry = journalEntry;
    }

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getJournalEntry() {
        return journalEntry;
    }

    public void setJournalEntry(String journalEntry) {
        this.journalEntry = journalEntry;
    }

    public List<ActivityTag> getActivityTags() {
        return activityTags;
    }

    public void setActivityTags(List<ActivityTag> activityTags) {
        this.activityTags = activityTags;
    }
}
