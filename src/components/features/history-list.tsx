// src/components/features/history-list.tsx
// 历史记录列表

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Download, Trash2, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { GenerationResult } from '@/types'

interface HistoryListProps {
  userId: string
}

interface HistoryItem {
  id: string
  appName: string
  style: string
  status: string
  paid: boolean
  createdAt: string
  results: Array<{
    id: string
    imageUrl: string
  }>
}

export function HistoryList({ userId }: HistoryListProps) {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [userId])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/user/generations')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">还没有生成记录</p>
        <Link href="/#generator">
          <Button className="mt-4">立即生成</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          {/* 图标预览 */}
          <div className="relative aspect-square bg-muted">
            {item.results[0] ? (
              <Image
                src={item.results[0].imageUrl}
                alt={item.appName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                无预览
              </div>
            )}
            
            {/* 状态标签 */}
            <div className="absolute left-2 top-2">
              {item.status === 'completed' && (
                <Badge variant="default" className="bg-green-500">
                  已完成
                </Badge>
              )}
              {item.status === 'processing' && (
                <Badge variant="secondary">生成中</Badge>
              )}
              {item.status === 'failed' && (
                <Badge variant="destructive">失败</Badge>
              )}
            </div>
            
            {/* 付费标签 */}
            {item.paid && (
              <div className="absolute right-2 top-2">
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  已购买
                </Badge>
              </div>
            )}
          </div>

          {/* 信息 */}
          <div className="p-4">
            <h3 className="font-semibold">{item.appName}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </p>

            {/* 操作按钮 */}
            <div className="mt-3 flex gap-2">
              <Link href={`/result/${item.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="mr-1 h-4 w-4" />
                  查看
                </Button>
              </Link>
              {item.paid && (
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  下载
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}