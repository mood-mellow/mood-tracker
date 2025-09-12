package com.moodtracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendDTO {
    private String id;        // FriendRequest ID
    private String friendId;  // ID of the other user
    private String friendName; // You can expand later with more user info
}
