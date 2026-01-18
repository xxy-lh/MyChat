package com.example.mychat.chat.model;

import com.example.mychat.infrastructure.util.SnowflakeIdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 聊天会话实体
 * 
 * 对应前端 Chat 接口
 */
@Entity
@Table(name = "chat_sessions", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_peer_id", columnList = "peer_id"),
        @Index(name = "idx_updated_at", columnList = "updated_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {

    /**
     * 会话ID（雪花算法生成）
     */
    @Id
    @Column(name = "id")
    private Long id;

    /**
     * 用户ID（会话拥有者）
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 对端ID（私聊为用户ID，群聊为群组ID）
     */
    @Column(name = "peer_id", nullable = false)
    private Long peerId;

    /**
     * 是否为群聊
     */
    @Column(name = "is_group")
    @Builder.Default
    private Boolean isGroup = false;

    /**
     * 群组名称（群聊时使用）
     */
    @Column(name = "group_name", length = 100)
    private String groupName;

    /**
     * 最后一条消息内容（预览）
     */
    @Column(name = "last_message", length = 200)
    private String lastMessage;

    /**
     * 最后消息时间
     */
    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;

    /**
     * 未读消息数
     * 
     * 注意：此字段仅用于持久化备份，实时数据从 Redis 获取
     */
    @Column(name = "unread_count")
    @Builder.Default
    private Integer unreadCount = 0;

    /**
     * 是否置顶
     */
    @Column(name = "is_pinned")
    @Builder.Default
    private Boolean isPinned = false;

    /**
     * 是否静音
     */
    @Column(name = "is_muted")
    @Builder.Default
    private Boolean isMuted = false;

    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 持久化前自动设置ID和时间
     */
    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = SnowflakeIdGenerator.getInstance().nextId();
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 更新前自动设置时间
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
