package com.moodtracker.backend.controller;

import com.moodtracker.backend.service.JournalAnalysisService;
import com.moodtracker.backend.dto.JournalAnalysisResult;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/journals")
public class JournalController {
    private final JournalAnalysisService analysisService;

    public JournalController(JournalAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/analyze")
    public JournalAnalysisResult analyzeJournal(@RequestBody String journalText) {
        return analysisService.analyze(journalText);
    }
}
