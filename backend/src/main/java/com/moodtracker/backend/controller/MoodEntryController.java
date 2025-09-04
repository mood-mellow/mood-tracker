package com.moodtracker.backend.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moodtracker.backend.dto.MoodEntryRequest;
import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.ActivityTagRepository;
import com.moodtracker.backend.repository.MoodEntryRepository;
import com.moodtracker.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/mood-entries")
public class MoodEntryController {

	private final MoodEntryRepository moodEntryRepository;
	private final UserRepository userRepository;
	private final ActivityTagRepository activityTagRepository;

	public MoodEntryController(MoodEntryRepository moodEntryRepository, UserRepository userRepository,
			ActivityTagRepository activityTagRepository) {
		this.moodEntryRepository = moodEntryRepository;
		this.userRepository = userRepository;
		this.activityTagRepository = activityTagRepository;
	}

	@PostMapping
	public ResponseEntity<MoodEntry> createMoodEntry(@RequestBody MoodEntryRequest dto,
			Authentication authentication) {
		// Extract userId from JWT Authentication and Cognito claim
		Jwt jwt = (Jwt) authentication.getPrincipal();
		String userId = jwt.getClaimAsString("sub");
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found."));

		List<ActivityTag> tags = activityTagRepository.findAllById(dto.getActivityTagIds());

		MoodEntry moodEntry = new MoodEntry();
		moodEntry.setMood(dto.getMood());
		moodEntry.setEmoji(dto.getEmoji());
		moodEntry.setColor(dto.getColor());
		moodEntry.setJournalEntry(dto.getJournalEntry());
		moodEntry.setUser(user);
		moodEntry.setActivityTags(tags);
		moodEntry.setTimestamp(LocalDateTime.now());

		MoodEntry saved = moodEntryRepository.save(moodEntry);
		return ResponseEntity.ok(saved);
	}

	@GetMapping
	public List<MoodEntry> getMoodEntries(
			Authentication authentication,
			@RequestParam(required = false) String start,
			@RequestParam(required = false) String end) {

		Jwt jwt = (Jwt) authentication.getPrincipal();
		String userId = jwt.getClaimAsString("sub");

		if (start == null || end == null) {
			return moodEntryRepository.findByUserId(userId);
		}
		try {
			LocalDateTime startDate = LocalDateTime.parse(start);
			LocalDateTime endDate = LocalDateTime.parse(end);
			return moodEntryRepository.findByUserIdAndTimestampBetween(
					userId, startDate, endDate);
		} catch (DateTimeParseException e) {
			throw new IllegalArgumentException("Invalid date format. Use ISO-8601 (e.g. 2025-08-01)");
		}
	}

	// Delete a mood entry
	@DeleteMapping("/{entryId}")
	public void deleteMoodEntry(@PathVariable String entryId) {
		moodEntryRepository.deleteById(entryId);
	}
}
