// src/app/layout.tsx
// 根布局

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AppIcon - AI App 图标生成器',
  description: '30 秒生成可上架的 App 图标。输入 App 名称和描述，AI 自动生成专业图标方案，一键导出 iOS、Android、小程序全平台规格。',
  keywords: ['App Icon', '图标生成', 'Logo Generator', 'AI', 'iOS', 'Android', '小程序'],
  authors: [{ name: 'AppIcon' }],
  openGraph: {
    title: 'AppIcon - AI App 图标生成器',
    description: '30 秒生成可上架的 App 图标',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppIcon - AI App 图标生成器',
    description: '30 秒生成可上架的 App 图标',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}