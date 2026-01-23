-- V7: 添加密码原文列到用户表
-- 用于存储用户密码的原文（仅供测试/演示目的）
-- 注意: Flyway 不支持 DELIMITER，使用简单的条件判断

-- 如果列不存在则添加（MySQL 8.0+ 特性会自动忽略已存在的列错误）
SET
    @column_exists = (
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'users'
            AND COLUMN_NAME = 'plain_password'
    );

SET
    @sql = IF(
        @column_exists = 0,
        'ALTER TABLE users ADD COLUMN plain_password VARCHAR(255) NULL COMMENT ''密码原文（仅供测试）''',
        'SELECT ''Column plain_password already exists'' AS info'
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;