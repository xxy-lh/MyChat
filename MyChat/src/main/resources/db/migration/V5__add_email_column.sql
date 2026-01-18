-- Flyway 迁移脚本 V5
-- 版本: V5
-- 说明: 修改 users 表，添加 email 列（如果不存在），修改 phone 为可空

-- 注意：此迁移已手动应用，以下语句使用条件执行避免重复

-- 检查并添加 email 列（如果不存在）
SET @column_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- phone 列已经是可空的，无需再次修改