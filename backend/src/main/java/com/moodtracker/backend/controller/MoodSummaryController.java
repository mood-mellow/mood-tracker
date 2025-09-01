package com.moodtracker.backend.controller;

import com.moodtracker.backend.dto.MoodSummaryResponse;
import com.moodtracker.backend.service.MoodSummaryService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mood-summary")
public class MoodSummaryController {

    @Autowired
    private MoodSummaryService moodSummaryService;

    @GetMapping
    public MoodSummaryResponse getWeeklySummary(
            @RequestParam("week") String week,
            @RequestParam("userId") String userId) {
        LocalDate startOfWeek = LocalDate.parse(week);
        return moodSummaryService.getWeeklySummary(userId, startOfWeek);
    }
}
