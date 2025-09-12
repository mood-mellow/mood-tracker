package com.moodtracker.backend.dto;

import java.util.List;

public class JournalAnalysisResult {
    private String mood;
    private double score;
    private List<String> keywords;

    public JournalAnalysisResult(String mood, double score, List<String> keywords) {
        this.mood = mood;
        this.score = score;
        this.keywords = keywords;
    }

    public String getMood() { return mood; }
    public double getScore() { return score; }
    public List<String> getKeywords() { return keywords; }
}
