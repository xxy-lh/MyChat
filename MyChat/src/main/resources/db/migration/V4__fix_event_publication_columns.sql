-- Flyway 迁移脚本 V4
-- 版本: V4
-- 说明: 修复 event_publication 表结构，添加 Spring Modulith 2.x 需要的新列

-- 删除旧表重建（因为表结构不兼容）
DROP TABLE IF EXISTS event_publication;

-- ========================================
-- Spring Modulith Event Publication 表
-- 完整版本，包含所有 2.x 需要的字段
-- ========================================
CREATE TABLE event_publication (
    id BINARY(16) NOT NULL PRIMARY KEY,
    listener_id VARCHAR(512) NOT NULL,
    event_type VARCHAR(512) NOT NULL,
    serialized_event TEXT NOT NULL,
    publication_date DATETIME(6) NOT NULL,
    completion_date DATETIME(6),
    completion_attempts INT DEFAULT 0,
    last_resubmission_date DATETIME(6),
    status VARCHAR(32) DEFAULT 'PENDING',
    INDEX idx_listener_id (listener_id),
    INDEX idx_publication_date (publication_date),
    INDEX idx_completion_date (completion_date),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Spring Modulith 事件发布表';