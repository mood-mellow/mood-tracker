package com.moodtracker.backend.controller;

import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.repository.ActivityTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity-tags")
public class ActivityTagController {

    @Autowired
    private ActivityTagRepository activityTagRepository;

    @GetMapping
    public List<ActivityTag> getAllTags() {
        return activityTagRepository.findAll();
    }

    @PostMapping
    public ActivityTag createTag(@RequestBody ActivityTag tag) {
        return activityTagRepository.save(tag);
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable Long id) {
        activityTagRepository.deleteById(id);
    }
}
