-- Flyway 迁移脚本 V2
-- 版本: V2
-- 说明: 添加 Spring Modulith 事件发布表

-- ========================================
-- Spring Modulith Event Publication 表
-- ========================================
CREATE TABLE IF NOT EXISTS event_publication (
    id VARCHAR(36) PRIMARY KEY,
    listener_id VARCHAR(512) NOT NULL,
    event_type VARCHAR(512) NOT NULL,
    serialized_event TEXT NOT NULL,
    publication_date DATETIME(6) NOT NULL,
    completion_date DATETIME(6),
    INDEX idx_listener_id (listener_id),
    INDEX idx_publication_date (publication_date),
    INDEX idx_completion_date (completion_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Spring Modulith 事件发布表';