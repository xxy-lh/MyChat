package com.example.mychat.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 好友关系实体
 */
@Entity
@Table(name = "friendships", indexes = {
        @Index(name = "idx_friendship_user", columnList = "userId"),
        @Index(name = "idx_friendship_friend", columnList = "friendId")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 好友ID
     */
    @Column(name = "friend_id", nullable = false)
    private Long friendId;

    /**
     * 好友状态
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;

    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * 更新时间
     */
    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    /**
     * 好友备注名
     */
    private String nickname;

    /**
     * 好友状态枚举
     */
    public enum FriendshipStatus {
        PENDING, // 待确认
        ACCEPTED, // 已接受
        BLOCKED // 已屏蔽
    }
}
