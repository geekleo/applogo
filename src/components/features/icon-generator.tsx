// src/components/features/icon-generator.tsx
// 图标生成器主组件

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StyleSelector } from './style-selector'
import { IconGrid } from './icon-grid'
import { DownloadPanel } from './download-panel'
import { ICON_STYLES } from '@/constants'
import type { IconStyle, GenerationResult, IconResultItem } from '@/types'

// 表单校验
const generatorSchema = z.object({
  appName: z
    .string()
    .min(2, 'App 名称至少 2 个字符')
    .max(30, 'App 名称最多 30 个字符'),
  description: z
    .string()
    .min(10, '描述至少 10 个字符')
    .max(200, '描述最多 200 个字符'),
  style: z.enum(['minimal', 'gradient', 'pixel', '3d', 'neon', 'handdrawn']),
})

type GeneratorFormData = z.infer<typeof generatorSchema>

export function IconGenerator() {
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('gradient')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [results, setResults] = useState<IconResultItem[]>([])
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      appName: '',
      description: '',
      style: 'gradient',
    },
  })

  // 处理风格选择
  const handleStyleChange = (style: IconStyle) => {
    setSelectedStyle(style)
    setValue('style', style)
  }

  // 提交生成
  const onSubmit = async (data: GeneratorFormData) => {
    setIsGenerating(true)
    setError(null)
    setResults([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('生成失败，请稍后重试')
      }

      const result = await response.json()
      setGenerationId(result.generationId)

      // 开始轮询状态
      pollGenerationStatus(result.generationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
      setIsGenerating(false)
    }
  }

  // 轮询生成状态
  const pollGenerationStatus = async (id: string) => {
    const maxAttempts = 90 // 最多等待 3 分钟
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`[轮询] 第 ${attempt + 1}/${maxAttempts} 次查询`)
        
        const response = await fetch(`/api/generate/${id}`)
        
        if (!response.ok) {
          console.error('[轮询] HTTP 错误:', response.status)
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data: GenerationResult = await response.json()

        console.log('[轮询] 状态:', data.status, '结果数量:', data.results?.length)

        if (data.status === 'completed' && data.results && data.results.length > 0) {
          console.log('[轮询] ✅ 生成成功！')
          setResults(data.results)
          setIsGenerating(false)
          // 滚动到结果区域
          setTimeout(() => {
            const el = document.getElementById('result-section')
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              el.classList.add('ring-2', 'ring-primary')
              setTimeout(() => el.classList.remove('ring-2', 'ring-primary'), 2000)
            }
          }, 100)
          return
        }

        if (data.status === 'failed') {
          console.error('[轮询] ❌ 生成失败:', data.error)
          setError(data.error || '生成失败')
          setIsGenerating(false)
          return
        }

        // 等待 2 秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (err: any) {
        console.error('[轮询] 错误:', err.message)
        // 继续轮询，不立即返回
        if (attempt >= maxAttempts - 1) {
          setError('生成超时，请稍后重试（可在"我的图标"中查看）')
          setIsGenerating(false)
        }
      }
    }
    
    // 超时但可能已经生成成功
    console.warn('[轮询] ⚠️ 超时，但可能已生成成功')
    setError('生成超时，请稍后重试（可在"我的图标"中查看）')
    setIsGenerating(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border bg-card p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-center">生成你的 App 图标</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* App 名称 */}
          <div className="space-y-2">
            <Label htmlFor="appName" className="text-center block">App 名称</Label>
            <Input
              id="appName"
              placeholder="例如：健康日记、记账本、日程助手"
              {...register('appName')}
              disabled={isGenerating}
              className="max-w-2xl mx-auto block"
            />
            {errors.appName && (
              <p className="text-sm text-destructive text-center">{errors.appName.message}</p>
            )}
          </div>

          {/* 一句话描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-center block">一句话描述</Label>
            <Textarea
              id="description"
              placeholder="描述你的 App 是做什么的，例如：一款帮助用户记录每日健康数据的生活工具"
              rows={3}
              {...register('description')}
              disabled={isGenerating}
              className="max-w-2xl mx-auto block"
            />
            {errors.description && (
              <p className="text-sm text-destructive text-center">{errors.description.message}</p>
            )}
          </div>

          {/* 风格选择 */}
          <div className="space-y-3">
            <Label className="text-center block">选择风格</Label>
            <StyleSelector
              styles={ICON_STYLES}
              selected={selectedStyle}
              onChange={handleStyleChange}
              disabled={isGenerating}
            />
            <input type="hidden" {...register('style')} />
            {errors.style && (
              <p className="text-sm text-destructive">{errors.style.message}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="min-w-[200px]"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  生成图标
                </>
              )}
            </Button>
          </div>
        </form>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-center text-destructive max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* 生成结果 */}
        {results.length > 0 && (
          <div id="result-section" className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold">选择你喜欢的图标</h3>
            <IconGrid
              icons={results}
              selectedId={selectedIconId}
              onSelect={setSelectedIconId}
            />
            {selectedIconId && (
              <DownloadPanel
                generationId={generationId!}
                iconId={selectedIconId}
                icons={results}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}