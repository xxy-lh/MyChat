-- Flyway 迁移脚本 V5
-- 版本: V5
-- 说明: 修改 users 表，添加 email 列（如果不存在），修改 phone 为可空

-- 添加 email 列（如果不存在）
-- 注意：MySQL 不支持 IF NOT EXISTS 用于列，所以使用存储过程
DELIMITER / /

CREATE PROCEDURE add_email_column_if_not_exists()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'email'
    ) THEN
        ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE;
    END IF;
END //

DELIMITER;

CALL add_email_column_if_not_exists ();

DROP PROCEDURE IF EXISTS add_email_column_if_not_exists;

-- 修改 phone 为可空（如果已经可空则不报错）
-- MySQL 不会因为已是 NULL 而报错
ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) NULL;