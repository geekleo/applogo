// src/lib/stripe.ts
// Stripe 支付集成

import Stripe from 'stripe'

// 懒加载 Stripe 客户端
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
      apiVersion: '2026-01-28.clover',
    })
  }
  return _stripe
}

export const stripe = getStripe()

// 价格配置
export const PRICES = {
  basic: {
    amount: 900, // $9.00
    currency: 'usd',
    name: 'AppIcon 基础版',
    description: '高清 PNG 全套尺寸，iOS / Android / Web',
  },
  pro: {
    amount: 1900, // $19.00
    currency: 'usd',
    name: 'AppIcon 完整版',
    description: 'SVG 矢量源文件 + 全平台规格 + 深色模式',
  },
}

/**
 * 创建 Checkout Session
 */
export async function createCheckoutSession(params: {
  userId: string
  generationId: string
  tier: 'basic' | 'pro'
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe()
  const { userId, generationId, tier, successUrl, cancelUrl } = params
  const price = PRICES[tier]

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: price.currency,
          product_data: {
            name: price.name,
            description: price.description,
          },
          unit_amount: price.amount,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      generationId,
      tier,
    },
    allow_promotion_codes: true,
  })

  return session
}

/**
 * 验证 Webhook 签名
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy'
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

/**
 * 获取 Checkout Session
 */
export async function getCheckoutSession(sessionId: string) {
  const stripe = getStripe()
  return stripe.checkout.sessions.retrieve(sessionId)
}