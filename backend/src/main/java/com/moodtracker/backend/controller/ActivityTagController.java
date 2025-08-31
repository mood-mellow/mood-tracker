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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moodtracker.backend.model.ActivityTag;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.ActivityTagRepository;
import com.moodtracker.backend.repository.UserRepository;
import com.moodtracker.backend.util.JwtUtil;

@RestController
@RequestMapping("/activity-tags")
@CrossOrigin(origins = "http://localhost:3000") // Add this line
public class ActivityTagController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityTagController.class);
    @Autowired
    private ActivityTagRepository activityTagRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<ActivityTag> getAllTags() {
        return activityTagRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityTag> updateTag(@PathVariable String id, @RequestBody ActivityTag tag,
            Authentication auth) {
        try {
            logger.info("Received request to update activity tag with ID: {}", id);

            String userId = jwtUtil.extractUserId(auth);
            logger.info("User ID from auth: {}", userId);

            // Find the existing activity tag
            ActivityTag existingTag = activityTagRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Activity tag not found with ID: " + id));

            // Verify that the tag belongs to the current user
            if (!existingTag.getUser().getId().equals(userId)) {
                logger.warn("User {} attempted to update activity tag {} owned by user {}",
                        userId, id, existingTag.getUser().getId());
                return ResponseEntity.status(403).build(); // Forbidden
            }

            // Update the label
            existingTag.setLabel(tag.getLabel());

            // Save the updated tag
            ActivityTag updatedTag = activityTagRepository.save(existingTag);

            logger.info("Successfully updated activity tag with ID: {}", updatedTag.getId());

            return ResponseEntity.ok(updatedTag);

        } catch (Exception e) {
            logger.error("Error updating activity tag: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<ActivityTag> createTag(@RequestBody ActivityTag tag, Authentication auth) {
        try {
            logger.info("Received request to create activity tag: {}", tag.getLabel());

            String userId = jwtUtil.extractUserId(auth);
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
