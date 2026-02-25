// src/components/features/user-settings.tsx
// 用户设置组件

'use client'

import { UserButton } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'
import { useEffect, useState } from 'react'

interface UserSettingsProps {
  user: {
    id: string
    emailAddresses: Array<{ emailAddress: string }>
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string
    createdAt: number
  }
}

interface UserStats {
  totalGenerations: number
  paidGenerations: number
  freeCredits: number
}

export function UserSettings({ user }: UserSettingsProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [user.id])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 账户信息 */}
      <Card>
        <CardHeader>
          <CardTitle>账户信息</CardTitle>
          <CardDescription>你的账户基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <div>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            注册时间: {new Date(user.createdAt).toLocaleDateString('zh-CN')}
          </div>
        </CardContent>
      </Card>

      {/* 使用统计 */}
      <Card>
        <CardHeader>
          <CardTitle>使用统计</CardTitle>
          <CardDescription>你的图标生成统计</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground">加载中...</div>
          ) : stats ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.totalGenerations}</div>
                <div className="text-sm text-muted-foreground">总生成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{stats.paidGenerations}</div>
                <div className="text-sm text-muted-foreground">已购买</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.freeCredits}</div>
                <div className="text-sm text-muted-foreground">免费额度</div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">无法加载统计</div>
          )}
        </CardContent>
      </Card>

      {/* 偏好设置 */}
      <Card>
        <CardHeader>
          <CardTitle>偏好设置</CardTitle>
          <CardDescription>自定义你的体验</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            更多设置选项即将推出...
          </p>
        </CardContent>
      </Card>

      {/* 危险区域 */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">危险区域</CardTitle>
          <CardDescription>不可逆的操作</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            如需删除账户，请联系客服。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}