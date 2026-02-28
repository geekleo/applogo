// src/components/features/result-view.tsx
// 生成结果展示组件

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Lock, Check, ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconGrid } from './icon-grid'
import { DownloadPanel } from './download-panel'
import type { IconStyle } from '@/types'
import { ICON_STYLES } from '@/constants'

interface ResultViewProps {
  generation: {
    id: string
    appName: string
    description: string
    style: string
    status: string
    paid: boolean
    results: Array<{
      id: string
      imageUrl: string
      svgUrl: string | null
      thumbUrl: string | null
      prompt: string
      seed: number | null
    }>
  }
}

export function ResultView({ generation }: ResultViewProps) {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(
    generation.results[0]?.id || null
  )

  const styleConfig = ICON_STYLES.find((s) => s.id === generation.style)

  return (
    <div className="mx-auto max-w-5xl">
      {/* 返回和编辑按钮 */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>
        <Link href={`/editor/${generation.id}`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            编辑图标
          </Button>
        </Link>
      </div>

      {/* 标题信息 */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{generation.appName}</h1>
          {generation.paid ? (
            <Badge className="bg-green-500">已购买</Badge>
          ) : (
            <Badge variant="outline">待购买</Badge>
          )}
        </div>
        <p className="mt-2 text-muted-foreground">{generation.description}</p>
        {styleConfig && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-xl">{styleConfig.icon}</span>
            <span>{styleConfig.name}</span>
          </div>
        )}
      </div>

      {/* 主内容 */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 图标选择 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">选择图标</h2>
          <IconGrid
            icons={generation.results}
            selectedId={selectedIconId}
            onSelect={setSelectedIconId}
          />
        </div>

        {/* 下载面板 */}
        <div>
          {selectedIconId ? (
            <DownloadPanel
              generationId={generation.id}
              iconId={selectedIconId}
              icons={generation.results}
            />
          ) : (
            <Card className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">请先选择一个图标</p>
            </Card>
          )}
        </div>
      </div>

      {/* 预览 Tabs */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">预览效果</h2>
        <Tabs defaultValue="appstore">
          <TabsList>
            <TabsTrigger value="appstore">App Store</TabsTrigger>
            <TabsTrigger value="wechat">微信小程序</TabsTrigger>
            <TabsTrigger value="desktop">桌面</TabsTrigger>
          </TabsList>
          <TabsContent value="appstore" className="mt-4">
            <AppStorePreview
              appName={generation.appName}
              iconUrl={generation.results.find((r) => r.id === selectedIconId)?.imageUrl}
            />
          </TabsContent>
          <TabsContent value="wechat" className="mt-4">
            <WeChatPreview
              appName={generation.appName}
              iconUrl={generation.results.find((r) => r.id === selectedIconId)?.imageUrl}
            />
          </TabsContent>
          <TabsContent value="desktop" className="mt-4">
            <DesktopPreview
              appName={generation.appName}
              iconUrl={generation.results.find((r) => r.id === selectedIconId)?.imageUrl}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// App Store 预览组件
function AppStorePreview({ appName, iconUrl }: { appName: string; iconUrl?: string }) {
  return (
    <Card className="mx-auto max-w-sm overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gray-300 shadow-lg">
          {iconUrl ? (
            <Image src={iconUrl} alt={appName} width={96} height={96} unoptimized />
          ) : (
            <div className="h-full w-full bg-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{appName}</h3>
          <p className="mt-1 text-sm text-gray-500">生活工具</p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm text-gray-500">4.8</span>
            {'⭐'.repeat(5)}
          </div>
        </div>
      </div>
      <Button className="mt-4 w-full rounded-full bg-blue-500 hover:bg-blue-600">
        获取
      </Button>
    </Card>
  )
}

// 微信小程序预览
function WeChatPreview({ appName, iconUrl }: { appName: string; iconUrl?: string }) {
  return (
    <Card className="mx-auto max-w-sm overflow-hidden bg-white p-4">
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
        <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-200">
          {iconUrl ? (
            <Image src={iconUrl} alt={appName} width={56} height={56} unoptimized />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{appName}</h4>
          <p className="text-xs text-gray-400">小程序</p>
        </div>
        <Button size="sm" variant="outline" className="rounded-full text-xs">
          打开
        </Button>
      </div>
    </Card>
  )
}

// 桌面预览
function DesktopPreview({ appName, iconUrl }: { appName: string; iconUrl?: string }) {
  return (
    <Card className="mx-auto max-w-sm overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600 p-8">
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 overflow-hidden rounded-xl bg-white/20 shadow-2xl backdrop-blur">
          {iconUrl ? (
            <Image src={iconUrl} alt={appName} width={80} height={80} unoptimized />
          ) : (
            <div className="h-full w-full bg-white/20" />
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-white">{appName}</p>
      </div>
    </Card>
  )
}