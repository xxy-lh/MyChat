package com.example.mychat.chat.model;

import com.example.mychat.infrastructure.util.SnowflakeIdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 消息实体
 * 
 * 对应前端 Message 接口
 */
@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_sender_id", columnList = "sender_id"),
        @Index(name = "idx_receiver_id", columnList = "receiver_id"),
        @Index(name = "idx_session_id", columnList = "session_id"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    /**
     * 消息ID（雪花算法生成）
     */
    @Id
    @Column(name = "id")
    private Long id;

    /**
     * 发送者ID
     */
    @Column(name = "sender_id", nullable = false)
    private Long senderId;
    /**
     * 接收者ID（用户ID或群组ID）
     */
    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    /**
     * 会话ID
     */
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    /**
     * 消息内容
     */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /**
     * 消息类型
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    @Builder.Default
    private MessageType type = MessageType.TEXT;

    /**
     * 消息状态
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private MessageStatus status = MessageStatus.SENDING;

    /**
     * 媒体文件 URL
     */
    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    /**
     * 文件名
     */
    @Column(name = "file_name", length = 200)
    private String fileName;

    /**
     * 文件大小
     */
    @Column(name = "file_size", length = 50)
    private String fileSize;

    /**
     * 客户端消息ID（用于去重）
     */
    @Column(name = "client_msg_id", length = 50)
    private String clientMsgId;

    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 消息类型枚举
     */
    public enum MessageType {
        TEXT, // 文本
        IMAGE, // 图片
        FILE, // 文件
        VOICE, // 语音
        VIDEO, // 视频
        LOCATION // 位置
    }

    /**
     * 消息状态枚举
     */
    public enum MessageStatus {
        SENDING, // 发送中
        SENT, // 已发送
        DELIVERED, // 已送达
        READ // 已读
    }

    /**
     * 持久化前自动设置ID和时间
     */
    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = SnowflakeIdGenerator.getInstance().nextId();
        }
        this.createdAt = LocalDateTime.now();
    }
}
