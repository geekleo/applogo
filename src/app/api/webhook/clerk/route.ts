// src/app/api/webhook/clerk/route.ts
// Clerk 用户同步 Webhook

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Webhook } from 'svix'

// Clerk Webhook 事件类型
interface ClerkWebhookEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
    image_url: string
    username: string | null
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const header = request.headers

    // 验证 Webhook 签名
    const svixId = header.get('svix-id')
    const svixTimestamp = header.get('svix-timestamp')
    const svixSignature = header.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
    }

    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
      console.error('Missing CLERK_WEBHOOK_SECRET')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const wh = new Webhook(secret)
    let event: ClerkWebhookEvent

    try {
      event = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent
    } catch (err) {
      console.error('Webhook verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 处理事件
    const { type, data } = event

    switch (type) {
      case 'user.created':
        await handleUserCreated(data)
        break
      case 'user.updated':
        await handleUserUpdated(data)
        break
      case 'user.deleted':
        await handleUserDeleted(data)
        break
      default:
        console.log(`Unhandled event type: ${type}`)
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

// 用户创建
async function handleUserCreated(data: ClerkWebhookEvent['data']) {
  await prisma.user.create({
    data: {
      id: data.id,
      email: data.email_addresses[0]?.email_address || '',
      name: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || '',
      image: data.image_url,
      freeCredits: 1, // 新用户送 1 次免费
    },
  })
  console.log(`User created: ${data.id}`)
}

// 用户更新
async function handleUserUpdated(data: ClerkWebhookEvent['data']) {
  await prisma.user.update({
    where: { id: data.id },
    data: {
      email: data.email_addresses[0]?.email_address || '',
      name: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || '',
      image: data.image_url,
    },
  })
  console.log(`User updated: ${data.id}`)
}

// 用户删除
async function handleUserDeleted(data: ClerkWebhookEvent['data']) {
  await prisma.user.delete({
    where: { id: data.id },
  })
  console.log(`User deleted: ${data.id}`)
}