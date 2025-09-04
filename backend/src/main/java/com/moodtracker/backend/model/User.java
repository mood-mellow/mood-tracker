package com.moodtracker.backend.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "\"users\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String username;
    private String email;

    // One user can have many activity tags
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityTag> activityTags;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MoodEntry> moodEntries;

    // Constructors
    public User() {
    }

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<MoodEntry> getMoodEntries() {
        return moodEntries;
    }

    public void setMoodEntries(List<MoodEntry> moodEntries) {
        this.moodEntries = moodEntries;
    }

    public List<ActivityTag> getActivityTags() {
        return activityTags;
    }

    public void setActivityTags(List<ActivityTag> activityTags) {
        this.activityTags = activityTags;
    }
}
