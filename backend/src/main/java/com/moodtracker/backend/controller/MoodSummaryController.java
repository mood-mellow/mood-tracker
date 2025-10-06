package com.moodtracker.backend.controller;

import com.moodtracker.backend.dto.MoodSummaryResponse;
import com.moodtracker.backend.service.MoodSummaryService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.ZoneId;

@RestController
@RequestMapping("/mood-summary")
public class MoodSummaryController {

	private final MoodSummaryService moodSummaryService;

    public MoodSummaryController(MoodSummaryService moodSummaryService) {
        this.moodSummaryService = moodSummaryService;
    }

	// week 0 will represent last 7 days, any increments represent preceding 7 days
	@GetMapping("/weekly")
    public MoodSummaryResponse getWeeklySummary(
        @RequestParam(defaultValue = "0") int offSet, @RequestParam ZoneId zone,
        Authentication authentication
	) {
		String userId = ((Jwt) authentication.getPrincipal()).getClaimAsString("sub");
		return moodSummaryService.getWeeklySummary(userId, offSet, zone);
	}

    @GetMapping("/monthly")
    public MoodSummaryResponse getMonthlySummary(
            @RequestParam(defaultValue = "0") int offSet, @RequestParam ZoneId zone,
            Authentication authentication
    ) {
        String userId = ((Jwt) authentication.getPrincipal()).getClaimAsString("sub");
        return moodSummaryService.getMonthlySummary(userId, offSet, zone);
    }

	@GetMapping("/mood-summary/range")
    public MoodSummaryResponse getSummaryForRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "custom") String periodType,
            @RequestParam(defaultValue = "0") int offSet,
            @RequestParam ZoneId zone,
            Authentication authentication) {

        String userId = ((Jwt) authentication.getPrincipal()).getClaimAsString("sub");

        return moodSummaryService.getSummaryForRange(userId, start, end, periodType, offSet, zone);
    }
}
