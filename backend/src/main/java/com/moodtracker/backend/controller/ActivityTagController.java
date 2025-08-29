package com.moodtracker.backend.controller;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.ActivityTagRepository;
import com.moodtracker.backend.repository.UserRepository;


@RestController
@RequestMapping("/activity-tags")
@CrossOrigin(origins = "http://localhost:3000") // Add this line
public class ActivityTagController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityTagController.class);
    @Autowired
    private ActivityTagRepository activityTagRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ActivityTag> getAllTags() {
        return activityTagRepository.findAll();
    }

@PostMapping
public ResponseEntity<ActivityTag> createTag(@RequestBody ActivityTag tag, Authentication auth) {
    try {
        logger.info("Received request to create activity tag: {}", tag.getLabel());
        
        String userId = "f1db9580-10c1-70aa-ceb6-5563884f4a66";
        logger.info("Looking for user with ID: {}", userId);
        
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        tag.setUser(currentUser);
        ActivityTag savedTag = activityTagRepository.save(tag);
        
        logger.info("Successfully created activity tag with ID: {}", savedTag.getId());
        
        // Make sure to return the saved tag as JSON
        return ResponseEntity.ok(savedTag);
        
    } catch (Exception e) {
        logger.error("Error creating activity tag: ", e);
        // Return proper error response
        return ResponseEntity.badRequest().build();
    }
}
    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable String id) {
        activityTagRepository.deleteById(id);
    }
}
