-- Flyway 迁移脚本 V3
-- 版本: V3
-- 说明: 修复 event_publication 表结构

-- 删除旧表（如果存在格式不正确的）
USE Telegram;

DROP TABLE IF EXISTS event_publication;

-- ========================================
-- Spring Modulith Event Publication 表
-- ID 使用 binary(16) 存储 UUID
-- ========================================
CREATE TABLE event_publication (
    id BINARY(16) NOT NULL PRIMARY KEY,
    listener_id VARCHAR(512) NOT NULL,
    event_type VARCHAR(512) NOT NULL,
    serialized_event TEXT NOT NULL,
    publication_date DATETIME(6) NOT NULL,
    completion_date DATETIME(6),
    INDEX idx_listener_id (listener_id),
    INDEX idx_publication_date (publication_date),
    INDEX idx_completion_date (completion_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Spring Modulith 事件发布表';