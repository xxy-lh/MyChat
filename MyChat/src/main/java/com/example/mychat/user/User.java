package com.example.mychat.user;

import com.example.mychat.infrastructure.util.SnowflakeIdGenerator;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * 用户实体
 * 
 * 对应前端 User 接口
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    /**
     * 用户ID（雪花算法生成）
     */
    @Id
    @Column(name = "id")
    private Long id;

    /**
     * 手机号（可选，用于绑定）
     */
    @Column(name = "phone", unique = true, length = 20)
    private String phone;

    /**
     * 邮箱（可选，用于绑定）
     */
    @Column(name = "email", unique = true, length = 100)
    private String email;

    /**
     * 密码（BCrypt 加密）
     */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * 密码原文（仅供测试/演示）
     */
    @Column(name = "plain_password")
    private String plainPassword;

    /**
     * 显示名称
     */
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    /**
     * 头像 URL
     */
    @Column(name = "avatar", length = 500)
    private String avatar;

    /**
     * 用户名（@handle）
     */
    @Column(name = "handle", unique = true, length = 30)
    private String handle;

    /**
     * 个人简介
     */
    @Column(name = "bio", length = 200)
    private String bio;

    /**
     * 所在地
     */
    @Column(name = "location", length = 100)
    private String location;

    /**
     * 在线状态
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.OFFLINE;

    /**
     * 最后在线时间
     */
    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    /**
     * 账号是否启用
     */
    @Column(name = "enabled")
    @Builder.Default
    private Boolean enabled = true;

    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 在线状态枚举
     */
    public enum UserStatus {
        ONLINE, // 在线
        OFFLINE, // 离线
        AWAY // 离开
    }

    /**
     * 持久化前自动设置ID和时间
     */
    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = SnowflakeIdGenerator.getInstance().nextId();
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 更新前自动设置时间
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ========== UserDetails 接口实现 ==========

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.name; // 使用用户名登录
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
