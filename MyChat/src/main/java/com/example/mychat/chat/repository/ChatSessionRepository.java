package com.example.mychat.chat.repository;

import com.example.mychat.chat.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 聊天会话数据访问接口
 */
@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    /**
     * 获取用户的所有会话（按最后消息时间降序）
     */
    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId);

    /**
     * 查找用户与对端的会话
     */
    Optional<ChatSession> findByUserIdAndPeerId(Long userId, Long peerId);

    /**
     * 查找或创建会话（双向）
     * 
     * 检查是否存在 userId->peerId 或 peerId->userId 的会话
     */
    @Query("SELECT cs FROM ChatSession cs WHERE " +
            "(cs.userId = :userId AND cs.peerId = :peerId) OR " +
            "(cs.userId = :peerId AND cs.peerId = :userId)")
    List<ChatSession> findBidirectionalSession(
            @Param("userId") Long userId,
            @Param("peerId") Long peerId);

    /**
     * 更新会话最后消息
     */
    @Modifying
    @Query("UPDATE ChatSession cs SET " +
            "cs.lastMessage = :lastMessage, " +
            "cs.lastMessageTime = :lastMessageTime, " +
            "cs.updatedAt = :updatedAt " +
            "WHERE cs.id = :sessionId")
    void updateLastMessage(
            @Param("sessionId") Long sessionId,
            @Param("lastMessage") String lastMessage,
            @Param("lastMessageTime") LocalDateTime lastMessageTime,
            @Param("updatedAt") LocalDateTime updatedAt);

    /**
     * 更新未读数
     */
    @Modifying
    @Query("UPDATE ChatSession cs SET cs.unreadCount = :unreadCount WHERE cs.id = :sessionId")
    void updateUnreadCount(
            @Param("sessionId") Long sessionId,
            @Param("unreadCount") Integer unreadCount);

    /**
     * 获取用户置顶的会话
     */
    List<ChatSession> findByUserIdAndIsPinnedTrueOrderByUpdatedAtDesc(Long userId);
}
