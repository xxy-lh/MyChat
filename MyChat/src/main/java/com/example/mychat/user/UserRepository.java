package com.example.mychat.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 用户数据访问接口
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据手机号查找用户
     */
    Optional<User> findByPhone(String phone);

    /**
     * 根据用户名（name字段）查找用户
     */
    Optional<User> findByName(String name);

    /**
     * 检查用户名是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据用户名查找用户
     */
    Optional<User> findByHandle(String handle);

    /**
     * 检查手机号是否存在
     */
    boolean existsByPhone(String phone);

    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);

    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 检查用户名是否存在
     */
    boolean existsByHandle(String handle);

    /**
     * 根据多个ID查找用户
     */
    List<User> findByIdIn(List<Long> ids);

    /**
     * 搜索用户（按名称或用户名模糊匹配）
     */
    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.handle LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);

    /**
     * 更新用户在线状态
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :status, u.lastSeen = :lastSeen WHERE u.id = :userId")
    void updateUserStatus(
            @Param("userId") Long userId,
            @Param("status") User.UserStatus status,
            @Param("lastSeen") LocalDateTime lastSeen);

    /**
     * 获取在线用户列表
     */
    List<User> findByStatus(User.UserStatus status);
}
