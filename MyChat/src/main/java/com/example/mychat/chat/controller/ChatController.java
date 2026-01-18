package com.example.mychat.chat.controller;

import com.example.mychat.chat.dto.ChatDTO;
import com.example.mychat.chat.dto.MessageDTO;
import com.example.mychat.chat.service.ChatService;
import com.example.mychat.infrastructure.web.Result;
import com.example.mychat.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 聊天控制器
 * 
 * 提供聊天相关 REST API
 */
@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 获取用户的聊天列表
     * 
     * GET /api/v1/chats
     */
    @GetMapping
    public Result<List<ChatDTO>> getChats(@AuthenticationPrincipal User user) {
        List<ChatDTO> chats = chatService.getUserChats(user.getId());
        return Result.success(chats);
    }

    /**
     * 获取会话的历史消息
     * 
     * GET /api/v1/chats/{sessionId}/messages
     */
    @GetMapping("/{sessionId}/messages")
    public Result<List<MessageDTO>> getMessages(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        List<MessageDTO> messages = chatService.getSessionMessages(sessionId, page, size);
        return Result.success(messages);
    }

    /**
     * 标记会话消息为已读
     * 
     * POST /api/v1/chats/{peerId}/read
     */
    @PostMapping("/{peerId}/read")
    public Result<Void> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long peerId) {

        chatService.clearUnreadCount(user.getId(), peerId);
        return Result.success("已标记为已读", null);
    }

    /**
     * 获取总未读数
     * 
     * GET /api/v1/chats/unread-count
     */
    @GetMapping("/unread-count")
    public Result<Integer> getTotalUnreadCount(@AuthenticationPrincipal User user) {
        Integer count = chatService.getTotalUnreadCount(user.getId());
        return Result.success(count);
    }
}
