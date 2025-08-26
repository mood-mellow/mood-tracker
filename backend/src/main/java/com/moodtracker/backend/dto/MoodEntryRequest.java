package com.moodtracker.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class MoodEntryRequest {
	private Long userId;
	private String mood;
	private String color;
	private String emoji;
	private String journalEntry;
	private List<Long> activityTagIds;
	private LocalDateTime timestamp;
	
	// Getters and setters
	public Long getUserId() {
		return userId;
	}
	
	public void setUserId(Long userId) {
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
		this.journalEntry();
	}
	
	public List<Long> getActivityTagIds() {
		return activityTagIds;
	}
	
	public void setActivityTagIds(List<Long> activityTagIds) {
		this.activityTagIds = activityTagIds;
	}
	
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}
