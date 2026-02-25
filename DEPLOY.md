# 推送代码到 GitHub

## 方法 1：使用 Personal Access Token

1. 生成 Token：
   - 登录 GitHub
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - 勾选 `repo` 权限
   - 生成并复制 Token

2. 推送代码：
```bash
cd /root/.openclaw/workspace-code-writer/appicon
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/geekleo/applogo.git
git push -u origin main
```

## 方法 2：使用 SSH

1. 生成 SSH Key：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

2. 添加到 GitHub：
   - Settings → SSH and GPG keys → New SSH key
   - 粘贴公钥

3. 推送代码：
```bash
cd /root/.openclaw/workspace-code-writer/appicon
git remote set-url origin git@github.com:geekleo/applogo.git
git push -u origin main
```

## 部署到 Vercel

1. 访问 https://vercel.com
2. Import Git Repository
3. 选择 `geekleo/applogo`
4. 配置环境变量：
   - DATABASE_URL
   - DIRECT_URL
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - REPLICATE_API_TOKEN
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
5. Deploy

---

## 完整的 .env.example

```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"

# Replicate
REPLICATE_API_TOKEN="r8_xxx"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
SUPABASE_SERVICE_ROLE_KEY="eyJxxx"

# Stripe (可选)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```