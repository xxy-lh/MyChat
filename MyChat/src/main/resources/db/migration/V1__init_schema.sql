-- Flyway 初始化脚本
-- 数据库: TeleChat
-- 版本: V1
-- 说明: 创建核心表结构

-- ========================================
-- 用户表
-- ========================================
USE TeleChat;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY COMMENT '用户ID（雪花算法）',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密）',
    name VARCHAR(50) NOT NULL COMMENT '显示名称',
    avatar VARCHAR(500) COMMENT '头像URL',
    handle VARCHAR(30) UNIQUE COMMENT '用户名（@handle）',
    bio VARCHAR(200) COMMENT '个人简介',
    location VARCHAR(100) COMMENT '所在地',
    status ENUM('ONLINE', 'OFFLINE', 'AWAY') DEFAULT 'OFFLINE' COMMENT '在线状态',
    last_seen DATETIME COMMENT '最后在线时间',
    enabled BOOLEAN DEFAULT TRUE COMMENT '账号是否启用',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_handle (handle),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表';

-- ========================================
-- 聊天会话表
-- ========================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGINT PRIMARY KEY COMMENT '会话ID（雪花算法）',
    user_id BIGINT NOT NULL COMMENT '用户ID（会话拥有者）',
    peer_id BIGINT NOT NULL COMMENT '对端ID（私聊为用户ID，群聊为群组ID）',
    is_group BOOLEAN DEFAULT FALSE COMMENT '是否为群聊',
    group_name VARCHAR(100) COMMENT '群组名称',
    last_message VARCHAR(200) COMMENT '最后一条消息预览',
    last_message_time DATETIME COMMENT '最后消息时间',
    unread_count INT DEFAULT 0 COMMENT '未读消息数（备份）',
    is_pinned BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    is_muted BOOLEAN DEFAULT FALSE COMMENT '是否静音',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_peer_id (peer_id),
    INDEX idx_updated_at (updated_at),
    UNIQUE KEY uk_user_peer (user_id, peer_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '聊天会话表';

-- ========================================
-- 消息表
-- ========================================
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY COMMENT '消息ID（雪花算法）',
    sender_id BIGINT NOT NULL COMMENT '发送者ID',
    receiver_id BIGINT NOT NULL COMMENT '接收者ID',
    session_id BIGINT NOT NULL COMMENT '会话ID',
    content TEXT COMMENT '消息内容',
    type ENUM(
        'TEXT',
        'IMAGE',
        'FILE',
        'VOICE',
        'VIDEO',
        'LOCATION'
    ) DEFAULT 'TEXT' COMMENT '消息类型',
    status ENUM(
        'SENDING',
        'SENT',
        'DELIVERED',
        'READ'
    ) DEFAULT 'SENDING' COMMENT '消息状态',
    media_url VARCHAR(500) COMMENT '媒体文件URL',
    file_name VARCHAR(200) COMMENT '文件名',
    file_size VARCHAR(50) COMMENT '文件大小',
    client_msg_id VARCHAR(50) COMMENT '客户端消息ID（去重）',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at),
    INDEX idx_client_msg_id (client_msg_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '消息表';

-- ========================================
-- 好友关系表（预留）
-- ========================================
CREATE TABLE IF NOT EXISTS user_friends (
    id BIGINT PRIMARY KEY COMMENT '关系ID（雪花算法）',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    friend_id BIGINT NOT NULL COMMENT '好友ID',
    status TINYINT DEFAULT 0 COMMENT '状态：0-申请中，1-已通过，2-已拒绝',
    remark VARCHAR(50) COMMENT '好友备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_friend_id (friend_id),
    UNIQUE KEY uk_user_friend (user_id, friend_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '好友关系表';

-- ========================================
-- 群组表（预留）
-- ========================================
CREATE TABLE IF NOT EXISTS chat_groups (
    id BIGINT PRIMARY KEY COMMENT '群组ID（雪花算法）',
    name VARCHAR(100) NOT NULL COMMENT '群组名称',
    description VARCHAR(500) COMMENT '群组描述',
    avatar VARCHAR(500) COMMENT '群组头像',
    owner_id BIGINT NOT NULL COMMENT '群主ID',
    member_count INT DEFAULT 0 COMMENT '成员数量',
    max_members INT DEFAULT 200 COMMENT '最大成员数',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_owner_id (owner_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '群组表';