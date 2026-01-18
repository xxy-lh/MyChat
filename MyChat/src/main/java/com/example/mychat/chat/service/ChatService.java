package com.example.mychat.chat.service;

import com.example.mychat.chat.dto.ChatDTO;
import com.example.mychat.chat.dto.MessageDTO;
import com.example.mychat.chat.model.ChatSession;
import com.example.mychat.chat.model.Message;
import com.example.mychat.chat.repository.ChatSessionRepository;
import com.example.mychat.chat.repository.MessageRepository;
import com.example.mychat.infrastructure.util.SnowflakeIdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 聊天服务
 * 
 * 处理消息发送、会话管理、未读数等业务逻辑
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    // Redis 键前缀
    private static final String UNREAD_COUNT_KEY = "chat:unread:";

    /**
     * 获取用户的聊天列表
     */
    public List<ChatDTO> getUserChats(Long userId) {
        List<ChatSession> sessions = chatSessionRepository
                .findByUserIdOrderByUpdatedAtDesc(userId);

        return sessions.stream()
                .map(session -> {
                    // 从 Redis 获取实时未读数
                    Integer unreadCount = getUnreadCount(userId, session.getPeerId());
                    return ChatDTO.fromEntity(session, unreadCount);
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取会话的历史消息
     */
    public List<MessageDTO> getSessionMessages(Long sessionId, int page, int size) {
        Page<Message> messages = messageRepository
                .findBySessionIdOrderByCreatedAtDesc(sessionId, PageRequest.of(page, size));

        return messages.getContent().stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 发送消息
     */
    @Transactional
    public MessageDTO sendMessage(Long senderId, Long receiverId, String content,
            Message.MessageType type, String clientMsgId) {
        // 消息去重
        if (clientMsgId != null && messageRepository.existsByClientMsgId(clientMsgId)) {
            log.warn("重复消息，忽略: {}", clientMsgId);
            return null;
        }

        // 获取或创建会话
        ChatSession session = getOrCreateSession(senderId, receiverId);

        // 创建消息
        Message message = Message.builder()
                .id(SnowflakeIdGenerator.getInstance().nextId())
                .senderId(senderId)
                .receiverId(receiverId)
                .sessionId(session.getId())
                .content(content)
                .type(type)
                .status(Message.MessageStatus.SENT)
                .clientMsgId(clientMsgId)
                .createdAt(LocalDateTime.now())
                .build();

        message = messageRepository.save(message);

        // 更新会话最后消息
        updateSessionLastMessage(session.getId(), content);

        // 增加接收者的未读数
        incrementUnreadCount(receiverId, senderId);

        log.debug("消息发送成功: {} -> {}, 内容: {}", senderId, receiverId, content);

        return MessageDTO.fromEntity(message);
    }

    /**
     * 获取或创建会话
     */
    @Transactional
    public ChatSession getOrCreateSession(Long userId, Long peerId) {
        // 查找已存在的会话
        return chatSessionRepository.findByUserIdAndPeerId(userId, peerId)
                .orElseGet(() -> {
                    // 创建新会话
                    ChatSession session = ChatSession.builder()
                            .userId(userId)
                            .peerId(peerId)
                            .isGroup(false)
                            .build();
                    session = chatSessionRepository.save(session);

                    // 同时为对方创建会话
                    ChatSession peerSession = ChatSession.builder()
                            .userId(peerId)
                            .peerId(userId)
                            .isGroup(false)
                            .build();
                    chatSessionRepository.save(peerSession);

                    log.debug("创建新会话: {} <-> {}", userId, peerId);
                    return session;
                });
    }

    /**
     * 更新会话最后消息
     */
    private void updateSessionLastMessage(Long sessionId, String lastMessage) {
        LocalDateTime now = LocalDateTime.now();
        String preview = lastMessage.length() > 50
                ? lastMessage.substring(0, 50) + "..."
                : lastMessage;
        chatSessionRepository.updateLastMessage(sessionId, preview, now, now);
    }

    /**
     * 增加未读数（Redis 原子操作）
     */
    public void incrementUnreadCount(Long userId, Long senderId) {
        String key = UNREAD_COUNT_KEY + userId + ":" + senderId;
        redisTemplate.opsForValue().increment(key);
    }

    /**
     * 获取未读数
     */
    public Integer getUnreadCount(Long userId, Long senderId) {
        String key = UNREAD_COUNT_KEY + userId + ":" + senderId;
        Object value = redisTemplate.opsForValue().get(key);
        return value != null ? ((Number) value).intValue() : 0;
    }

    /**
     * 清除未读数（标记已读）
     */
    @Transactional
    public void clearUnreadCount(Long userId, Long senderId) {
        String key = UNREAD_COUNT_KEY + userId + ":" + senderId;
        redisTemplate.delete(key);

        // 同步更新数据库中的消息状态
        ChatSession session = chatSessionRepository.findByUserIdAndPeerId(userId, senderId)
                .orElse(null);
        if (session != null) {
            messageRepository.markSessionMessagesAsRead(session.getId(), userId);
            chatSessionRepository.updateUnreadCount(session.getId(), 0);
        }

        log.debug("清除未读数: {} <- {}", userId, senderId);
    }

    /**
     * 获取用户总未读数
     */
    public Integer getTotalUnreadCount(Long userId) {
        // 获取用户所有会话
        List<ChatSession> sessions = chatSessionRepository
                .findByUserIdOrderByUpdatedAtDesc(userId);

        int total = 0;
        for (ChatSession session : sessions) {
            total += getUnreadCount(userId, session.getPeerId());
        }
        return total;
    }
}
