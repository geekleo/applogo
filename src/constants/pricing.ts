// src/constants/pricing.ts
// 定价配置

import type { PricingPlan } from '@/types'

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: '免费预览',
    price: 0,
    currency: 'usd',
    features: [
      '生成 4 个图标方案',
      '在线预览效果',
      '低分辨率预览下载',
      '带水印',
      '不支持 SVG',
    ],
    stripePriceId: '',
  },
  {
    id: 'basic',
    name: '基础版',
    price: 9,
    currency: 'usd',
    features: [
      '生成 4 个图标方案',
      '在线预览效果',
      '高清 PNG 全套尺寸',
      '无水印',
      'iOS / Android / Web 全规格',
      '7 天内重新下载',
    ],
    stripePriceId: process.env.STRIPE_PRICE_BASIC || '',
  },
  {
    id: 'pro',
    name: '完整版',
    price: 19,
    currency: 'usd',
    features: [
      '生成 4 个图标方案',
      '在线预览效果',
      '高清 PNG 全套尺寸',
      'SVG 矢量源文件',
      '无水印',
      'iOS / Android / Web / 微信 全规格',
      '深色模式版本',
      '品牌色方案建议',
      '永久重新下载',
    ],
    stripePriceId: process.env.STRIPE_PRICE_PRO || '',
  },
]

export const getPlanById = (id: string): PricingPlan | undefined => {
  return PRICING_PLANS.find((plan) => plan.id === id)
}

export const FREE_CREDITS = 1 // 新用户免费次数