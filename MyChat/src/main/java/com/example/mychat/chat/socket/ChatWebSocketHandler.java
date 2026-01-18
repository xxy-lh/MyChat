package com.example.mychat.chat.socket;

import com.example.mychat.chat.dto.MessageDTO;
import com.example.mychat.chat.model.Message;
import com.example.mychat.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket 消息处理器
 * 
 * 处理 STOMP 协议的消息收发
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageBrokerService messageBrokerService;

    /**
     * 处理发送消息
     * 
     * 客户端发送到: /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void handleSendMessage(@Payload SendMessageRequest request, Principal principal) {
        try {
            Long senderId = Long.parseLong(principal.getName());
            Long receiverId = Long.parseLong(request.getReceiverId());

            log.debug("收到消息: {} -> {}, 内容: {}", senderId, receiverId, request.getContent());

            // 保存消息到数据库
            MessageDTO messageDTO = chatService.sendMessage(
                    senderId,
                    receiverId,
                    request.getContent(),
                    Message.MessageType.valueOf(request.getType().toUpperCase()),
                    request.getClientMsgId());

            if (messageDTO != null) {
                // 通过 Redis Pub/Sub 广播消息
                messageBrokerService.publishMessage(receiverId, messageDTO);

                // 同时发送给发送者（确认消息已发送）
                messagingTemplate.convertAndSendToUser(
                        String.valueOf(senderId),
                        "/queue/messages",
                        messageDTO);

                log.debug("消息发送成功: {}", messageDTO.getId());
            }
        } catch (Exception e) {
            log.error("处理消息失败: ", e);
        }
    }

    /**
     * 处理已读回执
     * 
     * 客户端发送到: /app/chat.read
     */
    @MessageMapping("/chat.read")
    public void handleReadReceipt(@Payload ReadReceiptRequest request, Principal principal) {
        try {
            Long userId = Long.parseLong(principal.getName());
            Long senderId = Long.parseLong(request.getSenderId());

            // 清除未读数
            chatService.clearUnreadCount(userId, senderId);

            log.debug("已读回执: {} <- {}", userId, senderId);
        } catch (Exception e) {
            log.error("处理已读回执失败: ", e);
        }
    }

    /**
     * 处理心跳/在线状态
     * 
     * 客户端发送到: /app/chat.heartbeat
     */
    @MessageMapping("/chat.heartbeat")
    public void handleHeartbeat(Principal principal) {
        // 记录心跳，可用于维护在线状态
        log.trace("心跳: {}", principal.getName());
    }

    /**
     * 发送消息请求
     */
    @lombok.Data
    public static class SendMessageRequest {
        private String receiverId;
        private String content;
        private String type = "text";
        private String clientMsgId;
    }

    /**
     * 已读回执请求
     */
    @lombok.Data
    public static class ReadReceiptRequest {
        private String senderId;
    }
}
