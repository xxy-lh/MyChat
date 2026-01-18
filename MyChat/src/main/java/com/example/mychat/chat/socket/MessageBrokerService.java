package com.example.mychat.chat.socket;

import com.example.mychat.chat.dto.MessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

/**
 * 消息代理服务
 * 
 * 通过 Redis Pub/Sub 实现集群消息路由
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MessageBrokerService implements MessageListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisMessageListenerContainer listenerContainer;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    // Redis 消息主题
    private static final String CHAT_TOPIC = "chat.topic";

    /**
     * 初始化消息监听
     */
    @PostConstruct
    public void init() {
        // 订阅聊天消息主题
        listenerContainer.addMessageListener(this, new ChannelTopic(CHAT_TOPIC));
        log.info("已订阅 Redis 消息主题: {}", CHAT_TOPIC);
    }

    /**
     * 发布消息到 Redis
     * 
     * @param receiverId 接收者ID
     * @param message    消息内容
     */
    public void publishMessage(Long receiverId, MessageDTO message) {
        try {
            // 构建消息包装
            ChatMessageWrapper wrapper = new ChatMessageWrapper();
            wrapper.setReceiverId(receiverId);
            wrapper.setMessage(message);

            // 发布到 Redis
            redisTemplate.convertAndSend(CHAT_TOPIC, wrapper);

            log.debug("消息已发布到 Redis: -> {}", receiverId);
        } catch (Exception e) {
            log.error("发布消息到 Redis 失败: ", e);
        }
    }

    /**
     * 接收 Redis 消息
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // 反序列化消息
            String body = new String(message.getBody());
            ChatMessageWrapper wrapper = objectMapper.readValue(body, ChatMessageWrapper.class);

            // 推送给目标用户
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(wrapper.getReceiverId()),
                    "/queue/messages",
                    wrapper.getMessage());

            log.debug("消息已推送给用户: {}", wrapper.getReceiverId());
        } catch (Exception e) {
            log.error("处理 Redis 消息失败: ", e);
        }
    }

    /**
     * 消息包装类（用于 Redis 传输）
     */
    @lombok.Data
    public static class ChatMessageWrapper {
        private Long receiverId;
        private MessageDTO message;
    }
}
