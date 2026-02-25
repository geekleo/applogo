// src/app/api/webhook/stripe/route.ts
// Stripe Webhook 处理

import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    // 验证签名
    let event: Stripe.Event
    try {
      event = verifyWebhookSignature(payload, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 处理不同事件
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutExpired(session)
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 处理支付成功
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, generationId, tier } = session.metadata || {}

  if (!userId || !generationId) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  // 更新支付记录
  await prisma.payment.create({
    data: {
      userId,
      generationId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string || null,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'succeeded',
      tier: tier || 'basic',
    },
  })

  // 更新生成任务状态
  await prisma.generation.update({
    where: { id: generationId },
    data: {
      paid: true,
      paidAt: new Date(),
      tier: tier || 'basic',
    },
  })

  console.log(`Payment completed: userId=${userId}, generationId=${generationId}`)
}

// 处理支付过期
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const { generationId } = session.metadata || {}

  if (generationId) {
    // 可以记录过期事件
    console.log(`Checkout expired: generationId=${generationId}`)
  }
}
