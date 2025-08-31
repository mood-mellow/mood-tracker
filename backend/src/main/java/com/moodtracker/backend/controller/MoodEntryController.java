package com.moodtracker.backend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.MoodEntryRepository;
import com.moodtracker.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/mood-entries")
public class MoodEntryController {

	private final MoodEntryRepository moodEntryRepository;
	private final UserRepository userRepository;

	public MoodEntryController(MoodEntryRepository moodEntryRepository, UserRepository userRepository) {
		this.moodEntryRepository = moodEntryRepository;
		this.userRepository = userRepository;
	}

	@PostMapping
	public ResponseEntity<MoodEntry> createMoodEntry(@RequestBody MoodEntry moodEntry,
			Authentication authentication) {
		// Extract userId from JWT Authentication and Cognito claim
		Jwt jwt = (Jwt) authentication.getPrincipal();
		String userId = jwt.getClaimAsString("sub");

		// Find the User entity
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		// Attach user + timestamp
		moodEntry.setUser(user);
		moodEntry.setTimestamp(LocalDateTime.now());

		MoodEntry saved = moodEntryRepository.save(moodEntry);
		return ResponseEntity.ok(saved);
	}

	@GetMapping
	public List<MoodEntry> getMoodEntries(
			Authentication authentication,
			@RequestParam(required = false) String start,
			@RequestParam(required = false) String end) {
		// Extract userId from JWT Authentication and Cognito claim (consistent with
		// other methods)
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

	@DeleteMapping
	public ResponseEntity<?> deleteMoodEntriesInRange(
			@RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
			@RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
			@AuthenticationPrincipal Jwt jwt) {

		String userId = jwt.getClaimAsString("sub");

		// Convert LocalDate to LocalDateTime for comparison
		LocalDateTime startDateTime = start.atStartOfDay();
		LocalDateTime endDateTime = end.atTime(23, 59, 59);

		// Fetch entries for this user in date range
		List<MoodEntry> entries = moodEntryRepository.findByUserIdAndTimestampBetween(userId, startDateTime,
				endDateTime);

		if (entries.isEmpty()) {
			return ResponseEntity.noContent().build();
		}

		moodEntryRepository.deleteAll(entries);

		return ResponseEntity.noContent().build();
	}
}