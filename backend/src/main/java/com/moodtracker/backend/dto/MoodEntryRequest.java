package com.moodtracker.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class MoodEntryRequest {
	private String userId;
	private String mood;
	private String color;
	private String emoji;
	private String journalEntry;
	private List<String> activityTagIds;
	private LocalDateTime timestamp;

	// Getters and setters
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getMood() {
		return mood;
	}

	public void setMood(String mood) {
		this.mood = mood;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getEmoji() {
		return emoji;
	}

	public void setEmoji(String emoji) {
		this.emoji = emoji;
	}

	public String getJournalEntry() {
		return journalEntry;
	}

	public void setJournalEntry(String journalEntry) {
		this.journalEntry = journalEntry;
	}

	public List<String> getActivityTagIds() {
		return activityTagIds;
	}

	public void setActivityTagIds(List<String> activityTagIds) {
		this.activityTagIds = activityTagIds;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}
