package com.moodtracker.backend.repository;

import com.moodtracker.backend.model.ActivityTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActivityTagRepository extends JpaRepository<ActivityTag, Long> {
    Optional<ActivityTag> findByLabel(String label);
}
