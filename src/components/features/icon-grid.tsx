// src/components/features/icon-grid.tsx
// 图标网格展示

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Check, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { IconResultItem } from '@/types'

interface IconGridProps {
  icons: IconResultItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function IconGrid({ icons, selectedId, onSelect }: IconGridProps) {
  const [previewIcon, setPreviewIcon] = useState<IconResultItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {icons.map((icon, index) => (
          <div
            key={icon.id}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all',
              selectedId === icon.id
                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            {/* 图片 */}
            <div
              className="relative aspect-square"
              onClick={() => onSelect(icon.id)}
            >
              <Image
                src={icon.imageUrl}
                alt={`Icon option ${index + 1}`}
                fill
                className="object-cover"
                unoptimized // 外部图片
              />
              
              {/* 选中指示器 */}
              {selectedId === icon.id && (
                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
              
              {/* 放大按钮 */}
              <button
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewIcon(icon)
                }}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            
            {/* 标签 */}
            <div className="bg-muted/50 p-2 text-center text-xs text-muted-foreground">
              方案 {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* 预览弹窗 */}
      <Dialog open={!!previewIcon} onOpenChange={() => setPreviewIcon(null)}>
        <DialogContent className="max-w-2xl">
          {previewIcon && (
            <div className="relative aspect-square">
              <Image
                src={previewIcon.imageUrl}
                alt="Icon preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}