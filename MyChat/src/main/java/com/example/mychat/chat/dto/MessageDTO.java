package com.example.mychat.chat.dto;

import com.example.mychat.chat.model.Message;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 消息 DTO
 * 
 * 对应前端 Message 接口
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageDTO {

    /**
     * 消息ID
     */
    private String id;

    /**
     * 发送者ID
     */
    private String senderId;

    /**
     * 消息内容
     */
    private String text;

    /**
     * 时间戳
     */
    private String timestamp;

    /**
     * 是否已读
     */
    private Boolean isRead;

    /**
     * 消息类型
     */
    private String type;

    /**
     * 媒体 URL
     */
    private String mediaUrl;

    /**
     * 文件大小
     */
    private String fileSize;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 从实体转换
     */
    public static MessageDTO fromEntity(Message message) {
        if (message == null) {
            return null;
        }

        return MessageDTO.builder()
                .id(String.valueOf(message.getId()))
                .senderId(String.valueOf(message.getSenderId()))
                .text(message.getContent())
                .timestamp(formatTimestamp(message.getCreatedAt()))
                .isRead(message.getStatus() == Message.MessageStatus.READ)
                .type(message.getType().name().toLowerCase())
                .mediaUrl(message.getMediaUrl())
                .fileSize(message.getFileSize())
                .fileName(message.getFileName())
                .build();
    }

    /**
     * 格式化时间戳
     */
    private static String formatTimestamp(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
