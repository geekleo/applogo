// src/components/features/pricing.tsx
// 定价区域

'use client'

import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    name: '免费预览',
    price: 0,
    description: '体验生成效果',
    features: [
      '生成 4 个图标方案',
      '在线预览效果',
      '低分辨率预览',
      '带水印',
    ],
    notIncluded: ['SVG 矢量文件', '全尺寸导出', '深色模式'],
    buttonText: '免费试用',
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    id: 'basic',
    name: '基础版',
    price: 9,
    description: '适合个人开发者',
    features: [
      '生成 4 个图标方案',
      '高清 PNG 全套尺寸',
      'iOS / Android / Web',
      '无水印',
      '7 天内重新下载',
    ],
    notIncluded: ['SVG 矢量文件', '深色模式'],
    buttonText: '选择基础版',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    id: 'pro',
    name: '完整版',
    price: 19,
    description: '适合专业需求',
    features: [
      '生成 4 个图标方案',
      '高清 PNG 全套尺寸',
      'SVG 矢量源文件',
      '微信小程序规格',
      '深色模式版本',
      '品牌色方案建议',
      '永久重新下载',
    ],
    notIncluded: [],
    buttonText: '选择完整版',
    buttonVariant: 'secondary' as const,
    popular: false,
  },
]

export function Pricing() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            'relative rounded-2xl border p-6 transition-all',
            plan.popular
              ? 'border-primary shadow-lg ring-1 ring-primary/20'
              : 'hover:border-primary/50'
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                <Sparkles className="h-3 w-3" />
                最受欢迎
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold">${plan.price}</span>
            {plan.price > 0 && (
              <span className="text-muted-foreground">/次</span>
            )}
          </div>

          <ul className="mb-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
            {plan.notIncluded.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-muted-foreground line-through"
              >
                <span className="opacity-0">
                  <Check className="h-4 w-4" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant={plan.buttonVariant}
            className="w-full"
            disabled={plan.id === 'free'}
          >
            {plan.buttonText}
          </Button>
        </div>
      ))}
    </div>
  )
}