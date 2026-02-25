// src/types/index.ts
// 核心类型定义

// ============================================
// 图标风格
// ============================================
export type IconStyle = 'minimal' | 'gradient' | 'pixel' | '3d' | 'neon' | 'handdrawn'

export interface StyleConfig {
  id: IconStyle
  name: string
  nameEn: string
  icon: string
  description: string
  promptPrefix: string
  examples: string[]
}

// ============================================
// 生成任务
// ============================================
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface GenerationInput {
  appName: string
  description: string
  style: IconStyle
}

export interface GenerationResult {
  id: string
  status: GenerationStatus
  results: IconResultItem[]
  selectedId: string | null
  error?: string
}

export interface IconResultItem {
  id: string
  imageUrl: string
  svgUrl: string | null
  thumbUrl: string | null
  prompt: string
  seed: number | null
}

// ============================================
// 图标规格
// ============================================
export interface IconSpec {
  name: string
  size: number
  platform: 'ios' | 'android' | 'wechat' | 'web'
  mask?: 'circle' | 'rounded'
}

export type PlatformType = 'ios' | 'android' | 'wechat' | 'web'

// ============================================
// 支付
// ============================================
export type PaymentTier = 'free' | 'basic' | 'pro'
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded'

export interface PricingPlan {
  id: PaymentTier
  name: string
  price: number
  currency: string
  features: string[]
  stripePriceId: string
}

// ============================================
// API 响应
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}