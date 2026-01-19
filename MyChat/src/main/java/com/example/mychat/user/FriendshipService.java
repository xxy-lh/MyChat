package com.example.mychat.user;

import com.example.mychat.infrastructure.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 好友服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    /**
     * 发送好友请求
     */
    @Transactional
    public FriendshipDTO sendFriendRequest(Long userId, Long friendId) {
        // 不能添加自己
        if (userId.equals(friendId)) {
            throw new BusinessException("不能添加自己为好友", HttpStatus.BAD_REQUEST);
        }

        // 检查目标用户是否存在
        userRepository.findById(friendId)
                .orElseThrow(() -> new BusinessException("用户不存在", HttpStatus.NOT_FOUND));

        // 检查是否已有好友关系或请求
        if (friendshipRepository.hasExistingRequest(userId, friendId)) {
            throw new BusinessException("已存在好友关系或请求", HttpStatus.CONFLICT);
        }

        // 创建好友请求
        Friendship friendship = Friendship.builder()
                .userId(userId)
                .friendId(friendId)
                .status(Friendship.FriendshipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        friendship = friendshipRepository.save(friendship);
        log.info("用户 {} 向用户 {} 发送好友请求", userId, friendId);

        return toDTO(friendship);
    }

    /**
     * 接受好友请求
     */
    @Transactional
    public FriendshipDTO acceptFriendRequest(Long userId, Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("好友请求不存在", HttpStatus.NOT_FOUND));

        // 只有接收方可以接受请求
        if (!friendship.getFriendId().equals(userId)) {
            throw new BusinessException("无权操作此请求", HttpStatus.FORBIDDEN);
        }

        if (friendship.getStatus() != Friendship.FriendshipStatus.PENDING) {
            throw new BusinessException("请求已处理", HttpStatus.BAD_REQUEST);
        }

        friendship.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendship.setUpdatedAt(LocalDateTime.now());
        friendship = friendshipRepository.save(friendship);

        log.info("用户 {} 接受了用户 {} 的好友请求", userId, friendship.getUserId());

        return toDTO(friendship);
    }

    /**
     * 拒绝/删除好友请求
     */
    @Transactional
    public void rejectFriendRequest(Long userId, Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("好友请求不存在", HttpStatus.NOT_FOUND));

        // 双方都可以删除
        if (!friendship.getFriendId().equals(userId) && !friendship.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此请求", HttpStatus.FORBIDDEN);
        }

        friendshipRepository.delete(friendship);
        log.info("好友请求 {} 已删除", requestId);
    }

    /**
     * 删除好友
     */
    @Transactional
    public void deleteFriend(Long userId, Long friendId) {
        friendshipRepository.findByUserIdAndFriendId(userId, friendId)
                .ifPresentOrElse(
                        friendship -> {
                            friendshipRepository.delete(friendship);
                            log.info("用户 {} 删除了好友 {}", userId, friendId);
                        },
                        () -> {
                            throw new BusinessException("好友关系不存在", HttpStatus.NOT_FOUND);
                        });
    }

    /**
     * 获取好友列表
     */
    public List<UserDTO> getFriends(Long userId) {
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendships(userId);

        return friendships.stream()
                .map(f -> {
                    Long friendId = f.getUserId().equals(userId) ? f.getFriendId() : f.getUserId();
                    return userRepository.findById(friendId)
                            .map(UserDTO::fromEntity)
                            .orElse(null);
                })
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    /**
     * 获取待处理的好友请求
     */
    public List<FriendshipDTO> getPendingRequests(Long userId) {
        return friendshipRepository.findPendingRequests(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 获取已发送的好友请求
     */
    public List<FriendshipDTO> getSentRequests(Long userId) {
        return friendshipRepository.findSentRequests(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 检查是否是好友
     */
    public boolean areFriends(Long userId, Long friendId) {
        return friendshipRepository.areFriends(userId, friendId);
    }

    /**
     * 转换为 DTO
     */
    private FriendshipDTO toDTO(Friendship friendship) {
        UserDTO fromUser = userRepository.findById(friendship.getUserId())
                .map(UserDTO::fromEntity)
                .orElse(null);
        UserDTO toUser = userRepository.findById(friendship.getFriendId())
                .map(UserDTO::fromEntity)
                .orElse(null);

        return FriendshipDTO.builder()
                .id(friendship.getId())
                .fromUser(fromUser)
                .toUser(toUser)
                .status(friendship.getStatus().name())
                .createdAt(friendship.getCreatedAt().toString())
                .build();
    }
}
