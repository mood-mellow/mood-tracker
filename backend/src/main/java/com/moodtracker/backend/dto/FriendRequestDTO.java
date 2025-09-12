package com.moodtracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequestDTO {
    private String id;
    private String senderId;
    private String receiverId;
    private String status;
}
