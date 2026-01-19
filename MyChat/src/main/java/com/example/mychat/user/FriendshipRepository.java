package com.example.mychat.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 好友关系 Repository
 */
@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    /**
     * 查找两个用户之间的好友关系
     */
    @Query("SELECT f FROM Friendship f WHERE (f.userId = :userId AND f.friendId = :friendId) OR (f.userId = :friendId AND f.friendId = :userId)")
    Optional<Friendship> findByUserIdAndFriendId(@Param("userId") Long userId, @Param("friendId") Long friendId);

    /**
     * 查找用户的所有已接受好友关系
     */
    @Query("SELECT f FROM Friendship f WHERE (f.userId = :userId OR f.friendId = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendships(@Param("userId") Long userId);

    /**
     * 查找用户收到的好友请求（待确认）
     */
    @Query("SELECT f FROM Friendship f WHERE f.friendId = :userId AND f.status = 'PENDING'")
    List<Friendship> findPendingRequests(@Param("userId") Long userId);

    /**
     * 查找用户发送的好友请求
     */
    @Query("SELECT f FROM Friendship f WHERE f.userId = :userId AND f.status = 'PENDING'")
    List<Friendship> findSentRequests(@Param("userId") Long userId);

    /**
     * 检查两个用户是否已经是好友
     */
    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE ((f.userId = :userId AND f.friendId = :friendId) OR (f.userId = :friendId AND f.friendId = :userId)) AND f.status = 'ACCEPTED'")
    boolean areFriends(@Param("userId") Long userId, @Param("friendId") Long friendId);

    /**
     * 检查是否已有好友请求
     */
    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE (f.userId = :userId AND f.friendId = :friendId) OR (f.userId = :friendId AND f.friendId = :userId)")
    boolean hasExistingRequest(@Param("userId") Long userId, @Param("friendId") Long friendId);
}
