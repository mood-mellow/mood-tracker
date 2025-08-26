package com.moodtracker.backend.controller;

import com.moodtracker.backend.model.MoodEntry;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.MoodEntryRepository;
import com.moodtracker.backend.repository.UserRepository;
import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.repository.ActivityTagRepository;
import com.moodtracker.backend.dto.MoodEntryRequest;
import com.moodtracker.backend.service.MoodEntryService;
import com.moodtracker.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.oauth2.jwt.Jwt;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.time.format.DateTimeParseException;
import java.util.Optional;

@RestController
@RequestMapping("/mood-entries")
public class MoodEntryController {

    private final MoodEntryRepository moodEntryRepository;

    public MoodEntryController(MoodEntryRepository moodEntryRepository) {
        this.moodEntryRepository = moodEntryRepository;
    }

    // POST /mood-entries
    @PostMapping
    public ResponseEntity<MoodEntry> createMoodEntry(@RequestBody MoodEntry moodEntry,
                                                     Authentication authentication) {
        // Extract userId from JWT Authentication and Cognito claim
        Jwt jwt = (Jwt) authentication.getPrincipal();
		String userId = jwt.getClaimAsString("sub");
		
		// Attach user + timestamp        
		moodEntry.setUserId(userId); 
        moodEntry.setTimestamp(LocalDateTime.now());

        MoodEntry saved = moodEntryRepository.save(moodEntry);
        return ResponseEntity.ok(saved);
    }

    // GET /mood-entries
    @GetMapping
    public List<MoodEntry> getMoodEntries(
				Authentication authentication,
				@RequestParam(required = false) String start,
				@RequestParam(required = false) String end
				) {
		String userId = authentication.getName();
		
		if (start == null || end == null) {
			return moodEntryRepository.findByUserId(userId);
		}
		try {
			LocalDateTime startDate = LocalDateTime.parse(start);
			LocalDateTime endDate = LocalDateTime.parse(end);
			return moodEntryRepository.findByUserIdAndTimestampBetween(
				userId, startDate, endDate
			);
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

		// fetch entries for this user in date range
		List<MoodEntry> entries = moodEntryRepository.findByUserIdAndEntryDateBetween(userId, start, end);

		if (entries.isEmpty()) {
			return ResponseEntity.noContent().build();
		}

		moodEntryRepository.deleteAll(entries);

		return ResponseEntity.noContent().build();
	}
}
