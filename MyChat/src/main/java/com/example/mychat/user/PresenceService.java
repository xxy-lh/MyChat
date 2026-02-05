package com.example.mychat.user;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 在线状态服务
 * 
 * 管理用户在线状态并广播给相关好友
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PresenceService {

    private final SimpMessagingTemplate messagingTemplate;
    private final FriendshipService friendshipService;
    private final UserService userService;
    private final RedisTemplate<String, Object> redisTemplate;

    // Redis 键前缀
    private static final String USER_ONLINE_KEY = "user:online:";
    private static final long ONLINE_EXPIRE_SECONDS = 300; // 5分钟过期

    /**
     * 用户上线
     * 更新状态并通知所有好友
     */
    public void userOnline(Long userId) {
        // 更新 Redis 在线状态
        String key = USER_ONLINE_KEY + userId;
        redisTemplate.opsForValue().set(key, "1", ONLINE_EXPIRE_SECONDS, TimeUnit.SECONDS);

        // 更新数据库状态
        userService.updateOnlineStatus(userId, User.UserStatus.ONLINE);

        // 广播给所有好友
        broadcastPresence(userId, "ONLINE");

        log.info("用户 {} 上线", userId);
    }

    /**
     * 用户下线
     * 更新状态并通知所有好友
     */
    public void userOffline(Long userId) {
        // 删除 Redis 在线状态
        String key = USER_ONLINE_KEY + userId;
        redisTemplate.delete(key);

        // 更新数据库状态
        userService.updateOnlineStatus(userId, User.UserStatus.OFFLINE);

        // 广播给所有好友
        broadcastPresence(userId, "OFFLINE");

        log.info("用户 {} 下线", userId);
    }

    /**
     * 刷新在线状态（心跳）
     */
    public void refreshOnline(Long userId) {
        String key = USER_ONLINE_KEY + userId;
        redisTemplate.expire(key, ONLINE_EXPIRE_SECONDS, TimeUnit.SECONDS);
    }

    /**
     * 检查用户是否在线
     */
    public boolean isOnline(Long userId) {
        String key = USER_ONLINE_KEY + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * 广播用户在线状态给其所有好友
     */
    private void broadcastPresence(Long userId, String status) {
        try {
            // 获取用户的所有好友
            List<UserDTO> friends = friendshipService.getFriends(userId);

            if (friends.isEmpty()) {
                log.debug("用户 {} 没有好友，跳过广播", userId);
                return;
            }

            // 构建在线状态消息
            PresenceMessage presence = new PresenceMessage();
            presence.setUserId(String.valueOf(userId));
            presence.setStatus(status);
            presence.setTimestamp(LocalDateTime.now().toString());

            // 通知每个好友
            for (UserDTO friend : friends) {
                messagingTemplate.convertAndSendToUser(
                        friend.getId(),
                        "/queue/presence",
                        presence);
                log.debug("已通知用户 {} 关于用户 {} 的状态变更: {}", friend.getId(), userId, status);
            }

            log.info("已广播用户 {} 的状态 {} 给 {} 个好友", userId, status, friends.size());
        } catch (Exception e) {
            log.error("广播在线状态失败: ", e);
        }
    }

    /**
     * 在线状态消息
     */
    @Data
    public static class PresenceMessage {
        private String userId;
        private String status;
        private String timestamp;
    }
}
