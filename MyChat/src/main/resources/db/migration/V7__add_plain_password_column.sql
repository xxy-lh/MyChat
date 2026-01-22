-- V7: 添加密码原文列到用户表
-- 用于存储用户密码的原文（仅供测试/演示目的）

ALTER TABLE users
ADD COLUMN plain_password VARCHAR(255) NULL COMMENT '密码原文（仅供测试）';