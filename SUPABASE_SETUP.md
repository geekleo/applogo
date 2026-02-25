# Supabase 数据库配置指南

## 获取连接字符串

1. 登录 https://supabase.com/dashboard
2. 进入项目
3. Settings → Database
4. 复制 **Connection Pooling** 模式的连接字符串

格式类似：
```
postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.co:6543/postgres
```

## 启用数据库权限

在 Supabase Dashboard 中：

1. 进入 **SQL Editor**
2. 运行以下 SQL：

```sql
-- 确保 public schema 可访问
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

## 更新 .env.local

将连接字符串粘贴到 `.env.local`：

```
DATABASE_URL="你的完整连接字符串"
```

## 初始化数据库

```bash
cd appicon
npx prisma generate
npx prisma db push
```

## 验证

```bash
npx prisma studio
```

打开 https://prisma.studio 查看数据库。