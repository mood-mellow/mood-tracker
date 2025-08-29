package com.moodtracker.backend.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ActivityTag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String label;

    @JsonIgnore // prevent circular reference in JSON serialization
    @ManyToMany(mappedBy = "activityTags")
    private List<MoodEntry> moodEntries;

    @JsonIgnore // prevent user detail exposure
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Constructors
    public ActivityTag() {}

    public ActivityTag(String label) {
        this.label = label;
    }

    // Getters and Setters
    public String getId() { return id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public List<MoodEntry> getMoodEntries() { return moodEntries; }
    public void setMoodEntries(List<MoodEntry> moodEntries) { this.moodEntries = moodEntries; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
