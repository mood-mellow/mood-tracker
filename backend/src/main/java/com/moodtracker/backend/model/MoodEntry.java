package com.moodtracker.backend.model;

import jakarta.persistence.*;          // For @Entity, @Id, etc.
import java.time.LocalDateTime;        // For LocalDateTime
import java.util.List;                 // For List

@Entity
public class MoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;

    private String mood; // Consider converting this to an enum later

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "mood_entry_activity_tag",
        joinColumns = @JoinColumn(name = "mood_entry_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_tag_id")
    )
    private List<ActivityTag> activityTags;

    // --- Constructors ---

    public MoodEntry() {
        // JPA requires a default constructor
    }

    public MoodEntry(LocalDateTime timestamp, String mood, User user, List<ActivityTag> activityTags) {
        this.timestamp = timestamp;
        this.mood = mood;
        this.user = user;
        this.activityTags = activityTags;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
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

    public List<ActivityTag> getActivityTags() {
        return activityTags;
    }

    public void setActivityTags(List<ActivityTag> activityTags) {
        this.activityTags = activityTags;
    }
}