-- V6: 创建好友关系表
-- 用于存储用户之间的好友关系

CREATE TABLE IF NOT EXISTS friendships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '发起请求的用户ID',
    friend_id BIGINT NOT NULL COMMENT '接收请求的用户ID',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '好友状态: PENDING, ACCEPTED, BLOCKED',
    nickname VARCHAR(50) NULL COMMENT '好友备注名',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_friendship_user (user_id),
    INDEX idx_friendship_friend (friend_id),
    INDEX idx_friendship_status (status),
    UNIQUE KEY uk_friendship (user_id, friend_id),
    CONSTRAINT fk_friendship_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_friendship_friend FOREIGN KEY (friend_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '好友关系表';