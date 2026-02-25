// src/app/settings/page.tsx
// 用户设置页面

import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { UserSettings } from '@/components/features/user-settings'

export default async function SettingsPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">账户设置</h1>
          <p className="text-muted-foreground">管理你的账户信息和偏好</p>
        </div>

        <UserSettings user={user} />
      </div>
    </main>
  )
}