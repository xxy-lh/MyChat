package com.example.mychat.user;

import com.example.mychat.infrastructure.web.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 好友控制器
 */
@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    /**
     * 发送好友请求
     * POST /api/v1/friends/request
     */
    @PostMapping("/request")
    public Result<FriendshipDTO> sendRequest(
            @AuthenticationPrincipal User user,
            @RequestBody FriendRequest request) {
        Long friendId = Long.parseLong(request.getUserId());
        FriendshipDTO friendship = friendshipService.sendFriendRequest(user.getId(), friendId);
        return Result.success("好友请求已发送", friendship);
    }

    /**
     * 接受好友请求
     * POST /api/v1/friends/accept/{id}
     */
    @PostMapping("/accept/{id}")
    public Result<FriendshipDTO> acceptRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        FriendshipDTO friendship = friendshipService.acceptFriendRequest(user.getId(), id);
        return Result.success("已添加好友", friendship);
    }

    /**
     * 拒绝好友请求
     * DELETE /api/v1/friends/reject/{id}
     */
    @DeleteMapping("/reject/{id}")
    public Result<Void> rejectRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        friendshipService.rejectFriendRequest(user.getId(), id);
        return Result.successMessage("已拒绝请求");
    }

    /**
     * 删除好友
     * DELETE /api/v1/friends/{userId}
     */
    @DeleteMapping("/{userId}")
    public Result<Void> deleteFriend(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        friendshipService.deleteFriend(user.getId(), userId);
        return Result.successMessage("已删除好友");
    }

    /**
     * 获取好友列表
     * GET /api/v1/friends
     */
    @GetMapping
    public Result<List<UserDTO>> getFriends(@AuthenticationPrincipal User user) {
        List<UserDTO> friends = friendshipService.getFriends(user.getId());
        return Result.success(friends);
    }

    /**
     * 获取待处理的好友请求
     * GET /api/v1/friends/pending
     */
    @GetMapping("/pending")
    public Result<List<FriendshipDTO>> getPendingRequests(@AuthenticationPrincipal User user) {
        List<FriendshipDTO> requests = friendshipService.getPendingRequests(user.getId());
        return Result.success(requests);
    }

    /**
     * 获取已发送的好友请求
     * GET /api/v1/friends/sent
     */
    @GetMapping("/sent")
    public Result<List<FriendshipDTO>> getSentRequests(@AuthenticationPrincipal User user) {
        List<FriendshipDTO> requests = friendshipService.getSentRequests(user.getId());
        return Result.success(requests);
    }

    /**
     * 好友请求体
     */
    @lombok.Data
    public static class FriendRequest {
        private String userId;
    }
}
