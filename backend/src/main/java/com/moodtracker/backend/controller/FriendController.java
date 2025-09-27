package com.moodtracker.backend.controller;

import com.moodtracker.backend.dto.FriendDTO;
import com.moodtracker.backend.dto.FriendRequestDTO;
import com.moodtracker.backend.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;

    // get pending requests from senders using the receiverId
    @GetMapping("/pending-request/{receiverId}")
    public List<FriendRequestDTO> getPendingRequests(@PathVariable String receiverId) {
        return friendService.getPendingRequests(receiverId);
    }

    @PostMapping("/request")
    public FriendRequestDTO sendRequest(@RequestParam String senderId, @RequestParam String receiverId) {
        return friendService.sendRequest(senderId, receiverId);
    }

    @PutMapping("/accept/{id}")
    public FriendRequestDTO acceptRequest(@PathVariable String id) {
        return friendService.acceptRequest(id);
    }

    @GetMapping("/{userId}")
    public List<FriendDTO> getFriends(@PathVariable String userId) {
        return friendService.getFriends(userId);
    }
}
