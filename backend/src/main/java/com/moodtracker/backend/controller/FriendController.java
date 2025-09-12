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
