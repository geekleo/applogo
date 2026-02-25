-- Supabase 数据库权限配置
-- 在 Supabase SQL Editor 中运行此脚本

-- 启用 pgcrypto 扩展（用于 cuid）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 确保 public schema 可访问
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- 设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;

-- 创建应用用户（可选）
-- CREATE USER appicon_user WITH PASSWORD 'your_password';
-- GRANT ALL ON SCHEMA public TO appicon_user;