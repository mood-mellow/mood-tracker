package com.moodtracker.backend.controller;

import com.moodtracker.backend.dto.MoodSummaryResponse;
import com.moodtracker.backend.service.MoodSummaryService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/mood-summary")
public class MoodSummaryController {

	private final MoodSummaryService moodSummaryService;

    public MoodSummaryController(MoodSummaryService moodSummaryService) {
        this.moodSummaryService = moodSummaryService;
    }
	
	// week 0 will represent last 7 days, any increments represent preceding 7 days
	@GetMapping
    public MoodSummaryResponse getWeeklySummary(
        @RequestParam(defaultValue = "0") int week,
        Authentication authentication
	) {
		String userId = ((Jwt) authentication.getPrincipal()).getClaimAsString("sub");
		return moodSummaryService.getWeeklySummary(userId, week);
	}
}
