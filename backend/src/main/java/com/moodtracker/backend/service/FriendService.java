package com.moodtracker.backend.service;

import com.moodtracker.backend.dto.FriendDTO;
import com.moodtracker.backend.dto.FriendRequestDTO;
import com.moodtracker.backend.model.FriendRequest;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.FriendRequestRepository;
import com.moodtracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public FriendRequestDTO sendRequest(String senderId, String receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        FriendRequest request = FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendRequest.Status.PENDING)
                .build();

        FriendRequest saved = friendRequestRepository.save(request);

        return new FriendRequestDTO(saved.getId(),
                saved.getSender().getId(),
                saved.getReceiver().getId(),
                saved.getSender().getUsername(),
                saved.getReceiver().getUsername(),
                saved.getStatus().name());
    }

    public FriendRequestDTO acceptRequest(String requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId).orElseThrow();
        request.setStatus(FriendRequest.Status.ACCEPTED);
        FriendRequest saved = friendRequestRepository.save(request);

        return new FriendRequestDTO(saved.getId(),
                saved.getSender().getId(),
                saved.getReceiver().getId(),
                saved.getSender().getUsername(),
                saved.getReceiver().getUsername(),
                saved.getStatus().name());
    }

    public List<FriendRequestDTO> getPendingRequests(String receiverId) {
        User receiver = userRepository.findById(receiverId).orElseThrow();
        List<FriendRequest> pendingRequests = friendRequestRepository.findByReceiverAndStatus(receiver, FriendRequest.Status.PENDING);

        return pendingRequests.stream()
                .map(req -> {
                    User sender = req.getSender();
                    return new FriendRequestDTO(
                            req.getId(), sender.getId(), receiver.getId(), sender.getUsername(), receiver.getUsername(), FriendRequest.Status.PENDING.name());
                })
                .collect(Collectors.toList());
    }

    public List<FriendDTO> getFriends(String userId) {
        User user = userRepository.findById(userId).orElseThrow();

        List<FriendRequest> accepted = friendRequestRepository.findBySenderOrReceiverAndStatus(
                user, user, FriendRequest.Status.ACCEPTED
        );

        return accepted.stream()
                .map(req -> {
                    User friend = req.getSender().equals(user) ? req.getReceiver() : req.getSender();
                    return new FriendDTO(req.getId(), friend.getId(), friend.getUsername());
                })
                .collect(Collectors.toList());
    }
}
