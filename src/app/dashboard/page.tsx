// src/app/dashboard/page.tsx
// 用户中心 - 历史记录

import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { HistoryList } from '@/components/features/history-list'

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">我的图标</h1>
          <p className="text-muted-foreground">查看和管理你生成的所有图标</p>
        </div>

        <HistoryList userId={user.id} />
      </div>
    </main>
  )
}