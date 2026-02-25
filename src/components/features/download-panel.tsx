// src/components/features/download-panel.tsx
// 下载面板

'use client'

import { useState } from 'react'
import { Download, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { IconResultItem } from '@/types'

interface DownloadPanelProps {
  generationId: string
  iconId: string
  icons: IconResultItem[]
}

const PLATFORMS = [
  { id: 'ios', name: 'iOS', count: 18 },
  { id: 'android', name: 'Android', count: 11 },
  { id: 'wechat', name: '微信小程序', count: 3 },
  { id: 'web', name: 'Web', count: 7 },
]

export function DownloadPanel({ generationId, iconId, icons }: DownloadPanelProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ios', 'android'])
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleDownload = async (format: 'png' | 'svg' | 'zip') => {
    // 检查是否需要付费
    const requiresPayment = format !== 'png'
    
    if (requiresPayment) {
      setShowPaywall(true)
      return
    }

    setIsDownloading(true)
    try {
      const response = await fetch(
        `/api/download/${generationId}?iconId=${iconId}&format=${format}&platforms=${selectedPlatforms.join(',')}`
      )
      
      if (!response.ok) {
        throw new Error('下载失败')
      }
      
      // 下载文件
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `appicon-${iconId}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-muted/30 p-6">
      <h3 className="mb-4 text-lg font-semibold">下载图标</h3>

      {/* 平台选择 */}
      <div className="mb-6 space-y-3">
        <Label>选择平台</Label>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((platform) => (
            <label
              key={platform.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2 transition hover:bg-muted/50"
            >
              <Checkbox
                checked={selectedPlatforms.includes(platform.id)}
                onCheckedChange={() => togglePlatform(platform.id)}
              />
              <span className="text-sm">{platform.name}</span>
              <span className="text-xs text-muted-foreground">
                ({platform.count} 个尺寸)
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 下载按钮 */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => handleDownload('png')}
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          下载预览图 (带水印)
        </Button>
        
        <Button
          onClick={() => handleDownload('zip')}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          下载完整包 ($9)
        </Button>
        
        <Button variant="secondary" onClick={() => handleDownload('svg')}>
          <Lock className="mr-2 h-4 w-4" />
          SVG 矢量版 ($19)
        </Button>
      </div>

      {/* 付费墙提示 */}
      {showPaywall && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            解锁高清下载和 SVG 源文件，一次付费，永久使用。
          </p>
          <Button className="mt-2" size="sm">
            立即解锁
          </Button>
        </div>
      )}
    </div>
  )
}