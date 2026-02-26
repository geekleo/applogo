// src/app/api/generate/route.ts
// 图标生成 API

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { buildPromptVariations } from '@/prompts'
import { generateIcon } from '@/lib/replicate'
import { uploadToStorage, getIconPath } from '@/lib/supabase'
import type { IconStyle } from '@/types'

// 请求校验
const generateSchema = z.object({
  appName: z.string().min(2).max(30),
  description: z.string().min(10).max(200),
  style: z.enum(['minimal', 'gradient', 'pixel', '3d', 'neon', 'handdrawn']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 校验输入
    const validated = generateSchema.parse(body)
    const { appName, description, style } = validated

    // 获取当前用户
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 获取或创建用户记录
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { freeCredits: true },
    })

    // 如果用户不存在，创建新用户（送 1 次免费）
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.firstName || user.username || '',
          image: user.imageUrl,
          freeCredits: 1,
        },
        select: { freeCredits: true },
      })
    }

    // 检查免费额度
    if (dbUser.freeCredits <= 0) {
      return NextResponse.json(
        { error: 'No free credits remaining', requiresPayment: true, message: '免费额度已用完，请升级' },
        { status: 402 }
      )
    }

    // 创建生成任务
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        appName,
        description,
        style,
        status: 'pending',
      },
    })

    // 构建 Prompt 变体
    const prompts = buildPromptVariations(appName, description, style as IconStyle, 4)

    // 启动异步生成任务
    generateIconsAsync(generation.id, prompts, user.id)

    // 扣除免费额度
    await prisma.user.update({
      where: { id: user.id },
      data: { freeCredits: dbUser.freeCredits - 1 },
    })

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      estimatedTime: 15, // 预估 15 秒
    })
  } catch (error) {
    console.error('Generate API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 异步生成图标
async function generateIconsAsync(
  generationId: string,
  prompts: Array<{ prompt: string; negativePrompt: string; variation: number }>,
  userId: string
) {
  try {
    // 更新状态为 processing
    await prisma.generation.update({
      where: { id: generationId },
      data: { status: 'processing' },
    })

    // 调用 Replicate API 生成图标
    const results = await Promise.all(
      prompts.map(async (p, index) => {
        try {
          // 生成图标
          const { imageUrl, seed } = await generateIcon({
            prompt: p.prompt,
            negativePrompt: p.negativePrompt,
          })

          // 下载图片
          const response = await fetch(imageUrl)
          const buffer = Buffer.from(await response.arrayBuffer())

          // 上传到 Supabase Storage
          const storagePath = getIconPath(generationId, index)
          const storageUrl = await uploadToStorage(buffer, storagePath)

          // 生成缩略图
          const thumbBuffer = await resizeImage(buffer, 128)
          const thumbPath = `${storagePath}-thumb`
          const thumbUrl = await uploadToStorage(thumbBuffer, thumbPath)

          return {
            generationId,
            imageUrl: storageUrl,
            svgUrl: null,
            thumbUrl,
            prompt: p.prompt,
            seed,
          }
        } catch (error: any) {
          console.error(`Failed to generate icon ${index}:`, error)
          
          // 检查是否是余额不足
          if (error.message?.includes('billing') || error.message?.includes('credits')) {
            throw new Error('Replicate API 余额不足，请充值后重试')
          }
          
          // 返回占位图
          return {
            generationId,
            imageUrl: `https://via.placeholder.com/512?text=Error+${index + 1}`,
            svgUrl: null,
            thumbUrl: null,
            prompt: p.prompt,
            seed: 0,
          }
        }
      })
    )

    // 保存结果
    await prisma.iconResult.createMany({
      data: results,
    })

    // 更新状态为 completed
    await prisma.generation.update({
      where: { id: generationId },
      data: { status: 'completed' },
    })
  } catch (error) {
    console.error('Generate icons error:', error)
    
    // 更新状态为 failed
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
}

// 调整图像尺寸（用于缩略图）
async function resizeImage(buffer: Buffer, size: number): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  return sharp(buffer)
    .resize(size, size, { fit: 'contain' })
    .png()
    .toBuffer()
}