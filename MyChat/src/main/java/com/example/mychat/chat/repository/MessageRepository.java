package com.example.mychat.chat.repository;

import com.example.mychat.chat.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 消息数据访问接口
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * 根据会话ID获取消息（分页，按时间降序）
     */
    Page<Message> findBySessionIdOrderByCreatedAtDesc(Long sessionId, Pageable pageable);

    /**
     * 根据会话ID获取最近消息
     */
    List<Message> findTop50BySessionIdOrderByCreatedAtDesc(Long sessionId);

    /**
     * 根据客户端消息ID查找（去重用）
     */
    boolean existsByClientMsgId(String clientMsgId);

    /**
     * 更新消息状态
     */
    @Modifying
    @Query("UPDATE Message m SET m.status = :status WHERE m.id = :messageId")
    void updateMessageStatus(
            @Param("messageId") Long messageId,
            @Param("status") Message.MessageStatus status);

    /**
     * 批量更新会话消息为已读
     */
    @Modifying
    @Query("UPDATE Message m SET m.status = 'READ' " +
            "WHERE m.sessionId = :sessionId AND m.receiverId = :userId AND m.status != 'READ'")
    int markSessionMessagesAsRead(
            @Param("sessionId") Long sessionId,
            @Param("userId") Long userId);

    /**
     * 获取用户与对方的私聊消息
     */
    @Query("SELECT m FROM Message m WHERE " +
            "(m.senderId = :userId AND m.receiverId = :peerId) OR " +
            "(m.senderId = :peerId AND m.receiverId = :userId) " +
            "ORDER BY m.createdAt DESC")
    Page<Message> findPrivateMessages(
            @Param("userId") Long userId,
            @Param("peerId") Long peerId,
            Pageable pageable);
}
