package com.example.mychat.chat.dto;

import com.example.mychat.chat.model.ChatSession;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 聊天会话 DTO
 * 
 * 对应前端 Chat 接口
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatDTO {

    /**
     * 会话ID
     */
    private String id;

    /**
     * 用户ID（会话对端）
     */
    private String userId;

    /**
     * 最后消息内容
     */
    private String lastMessage;

    /**
     * 最后消息时间
     */
    private String lastMessageTime;

    /**
     * 未读消息数
     */
    private Integer unreadCount;

    /**
     * 是否为群聊
     */
    private Boolean isGroup;

    /**
     * 群组名称
     */
    private String groupName;

    /**
     * 从实体转换
     */
    public static ChatDTO fromEntity(ChatSession session) {
        return fromEntity(session, null);
    }

    /**
     * 从实体转换（带未读数）
     */
    public static ChatDTO fromEntity(ChatSession session, Integer redisUnreadCount) {
        if (session == null) {
            return null;
        }

        return ChatDTO.builder()
                .id(String.valueOf(session.getId()))
                .userId(String.valueOf(session.getPeerId()))
                .lastMessage(session.getLastMessage())
                .lastMessageTime(formatTime(session.getLastMessageTime()))
                .unreadCount(redisUnreadCount != null ? redisUnreadCount : session.getUnreadCount())
                .isGroup(session.getIsGroup())
                .groupName(session.getGroupName())
                .build();
    }

    /**
     * 格式化时间
     */
    private static String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime today = now.toLocalDate().atStartOfDay();
        LocalDateTime yesterday = today.minusDays(1);
        LocalDateTime thisWeek = today.minusDays(7);

        if (dateTime.isAfter(today)) {
            // 今天：显示时间
            return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        } else if (dateTime.isAfter(yesterday)) {
            // 昨天
            return "昨天";
        } else if (dateTime.isAfter(thisWeek)) {
            // 本周：显示星期
            String[] weekDays = { "周日", "周一", "周二", "周三", "周四", "周五", "周六" };
            return weekDays[dateTime.getDayOfWeek().getValue() % 7];
        } else {
            // 更早：显示日期
            return dateTime.format(DateTimeFormatter.ofPattern("MM-dd"));
        }
    }
}
