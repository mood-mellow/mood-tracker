package com.moodtracker.backend.repository;

import com.moodtracker.backend.model.FriendRequest;
import com.moodtracker.backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, String> {
    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequest.Status status);
    List<FriendRequest> findBySenderAndStatus(User sender, FriendRequest.Status status);
    List<FriendRequest> findBySenderOrReceiverAndStatus(User sender, User receiver, FriendRequest.Status status);
}
