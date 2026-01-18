package com.example.mychat.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 用户数据传输对象
 *
 * 对应前端 User 接口
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    /**
     * 用户ID（字符串格式，兼容前端）
     */
    private String id;

    /**
     * 显示名称
     */
    private String name;

    /**
     * 头像 URL
     */
    private String avatar;

    /**
     * 在线状态
     */
    private String status;

    /**
     * 最后在线时间（格式化字符串）
     */
    private String lastSeen;

    /**
     * 用户名（@handle）
     */
    private String handle;

    /**
     * 个人简介
     */
    private String bio;

    /**
     * 所在地
     */
    private String location;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 从实体转换为 DTO
     */
    public static UserDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(String.valueOf(user.getId()))
                .name(user.getName())
                .avatar(user.getAvatar())
                .status(user.getStatus().name().toLowerCase())
                .lastSeen(formatLastSeen(user.getLastSeen()))
                .handle(user.getHandle())
                .bio(user.getBio())
                .location(user.getLocation())
                .phone(user.getPhone()) // 不脱敏，用于显示绑定状态
                .email(maskEmail(user.getEmail()))
                .build();
    }

    /**
     * 邮箱脱敏
     */
    private static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@");
        if (parts[0].length() <= 2) {
            return email;
        }
        return parts[0].substring(0, 2) + "***@" + parts[1];
    }

    /**
     * 格式化最后在线时间
     */
    private static String formatLastSeen(LocalDateTime lastSeen) {
        if (lastSeen == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(lastSeen, now).toMinutes();

        if (minutes < 1) {
            return "刚刚";
        } else if (minutes < 60) {
            return minutes + "分钟前";
        } else if (minutes < 1440) {
            return (minutes / 60) + "小时前";
        } else if (minutes < 10080) {
            return (minutes / 1440) + "天前";
        } else {
            return lastSeen.format(DateTimeFormatter.ofPattern("MM-dd HH:mm"));
        }
    }

    /**
     * 手机号脱敏
     */
    private static String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
    }
}
