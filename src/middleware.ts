// src/middleware.ts
// Clerk 认证中间件

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 公开路由（无需登录）
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/generate(.*)',
  '/api/download(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // 只在有 Clerk key 时启用认证
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  }
})

export const config = {
  matcher: [
    // 匹配所有路径除了静态文件
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
}