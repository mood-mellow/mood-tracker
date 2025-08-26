package com.moodtracker.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ActivityTag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String label;

    @ManyToMany(mappedBy = "activityTags")
    private List<MoodEntry> moodEntries;

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
}
