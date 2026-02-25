# AppIcon - AI App 图标生成器

> Ship your app, we handle the icon.

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env.local` 文件：

```bash
# 数据库 (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."

# Clerk 认证 ✅ 已配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Replicate AI 生成
REPLICATE_API_TOKEN="r8_..."

# Stripe 支付
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Cloudflare R2 存储
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="appicon"
R2_ENDPOINT="https://..."
R2_PUBLIC_URL="https://..."
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送 Schema 到数据库
npx prisma db push

# 或者运行迁移
npx prisma migrate dev
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 📁 项目结构

```
appicon/
├── prisma/
│   └── schema.prisma          # 数据模型
├── src/
│   ├── app/
│   │   ├── api/               # API 路由
│   │   ├── dashboard/         # 用户中心
│   │   ├── result/            # 结果页面
│   │   ├── sign-in/           # 登录
│   │   ├── sign-up/           # 注册
│   │   ├── settings/          # 设置
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/
│   │   ├── ui/                # shadcn/ui 组件
│   │   └── features/          # 业务组件
│   ├── constants/             # 常量配置
│   ├── lib/                   # 工具库
│   ├── prompts/               # Prompt 工程
│   └── types/                 # TypeScript 类型
└── .env.local                 # 环境变量
```

---

## 🔧 服务配置

### Clerk (认证)
1. 访问 https://dashboard.clerk.com
2. 创建应用
3. 复制 API Keys 到 `.env.local`

### Supabase (数据库)
1. 访问 https://supabase.com
2. 创建新项目
3. 获取 DATABASE_URL

### Replicate (AI 生成)
1. 访问 https://replicate.com
2. 获取 API Token
3. 支持 Flux 模型

### Stripe (支付)
1. 访问 https://dashboard.stripe.com
2. 创建 Products 和 Prices
3. 配置 Webhook 端点

### Cloudflare R2 (存储)
1. 访问 Cloudflare Dashboard
2. 创建 R2 Bucket
3. 生成 API Token

---

## 📦 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel deploy

# 设置环境变量
vercel env add
```

### 环境变量（生产）

在 Vercel Dashboard 中设置所有环境变量。

---

## 🛠️ 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库
npx prisma studio        # 数据库 GUI
npx prisma generate      # 生成客户端
npx prisma db push       # 推送 Schema
npx prisma migrate dev   # 开发迁移
```

---

## 📄 License

MIT