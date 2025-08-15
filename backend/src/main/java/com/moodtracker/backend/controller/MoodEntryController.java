package com.moodtracker.backend.controller;

import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.repository.MoodEntryRepository;
import com.moodtracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/mood-entries")
public class MoodEntryController {

	@Autowired
	private MoodEntryRepository moodEntryRepository;

	@Autowired
	private UserRepository userRepository;

	// Getting all mood entries
	@GetMapping
	public List<MoodEntry> getAllMoodEntries() {
		return moodEntryRepository.findAll();
	}

	// Getting mood entries by user
	@GetMapping("/user/{userId}")
	public List<MoodEntry> getMoodEntriesByUser(@PathVariable Long userId) {
		return userRepository.findById(userId)
			.map(moodEntryRepository::findByUserId)
			.orElseThrow(() -> new RuntimeException("User not found."));
	}

	// Getting mood entries in a date range
	@GetMapping("/user/{userId}/range")
	public List<MoodEntry> getMoodEntriesInRange(
		@PathVariable Long userId,
		@RequestParam String start,
		@RequestParam String end
	) {
		LocalDateTime startTime = LocalDateTime.parse(start);
		LocalDateTime endTime = LocalDateTime.parse(end);

		return userRepository.findById(userId)
			.map(user -> moodEntryRepository.findByUserAndTimestampBetween(user, startTime, endTime))
			.orElseThrow(() -> new RuntimeException("User not found."));
	}

	// Delete a mood entry
	@DeleteMapping("/{entryId}")
	public void deleteMoodEntry(@PathVariable Long entryId) {
		moodEntryRepository.deleteById(entryId);
	}
}
