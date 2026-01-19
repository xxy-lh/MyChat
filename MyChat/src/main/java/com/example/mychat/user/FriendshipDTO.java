package com.example.mychat.user;

import lombok.Builder;
import lombok.Data;

/**
 * 好友关系 DTO
 */
@Data
@Builder
public class FriendshipDTO {
    private Long id;
    private UserDTO fromUser;
    private UserDTO toUser;
    private String status;
    private String createdAt;
}
