// src/app/api/download/[id]/route.ts
// 图标下载 API

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const iconId = searchParams.get('iconId')
    const format = searchParams.get('format') || 'png'
    const platforms = searchParams.get('platforms')?.split(',') || ['ios', 'android']

    // 查询生成任务
    const generation = await prisma.generation.findUnique({
      where: { id },
      include: { results: true },
    })

    if (!generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // 查找指定的图标
    const icon = iconId
      ? generation.results.find((r: { id: string }) => r.id === iconId)
      : generation.results[0]

    if (!icon) {
      return NextResponse.json({ error: 'Icon not found' }, { status: 404 })
    }

    // 检查付费状态
    if (!generation.paid && format !== 'png') {
      return NextResponse.json(
        { error: 'Payment required', requiresPayment: true },
        { status: 402 }
      )
    }

    // TODO: 实际的下载逻辑
    // 1. 从 R2 获取原图
    // 2. 使用 Sharp 生成各种尺寸
    // 3. 打包为 ZIP

    // 目前返回模拟响应
    if (format === 'png') {
      // 免费预览（带水印）
      return NextResponse.json({
        url: icon.imageUrl,
        watermarked: true,
        message: '免费预览版带水印',
      })
    }

    if (format === 'zip') {
      // 付费完整包
      return NextResponse.json({
        url: '#', // TODO: 实际的 ZIP 下载链接
        platforms,
        message: '需要付费解锁',
        requiresPayment: true,
      })
    }

    if (format === 'svg') {
      // SVG 矢量版
      if (!icon.svgUrl) {
        return NextResponse.json(
          { error: 'SVG not available', requiresPayment: true },
          { status: 404 }
        )
      }
      return NextResponse.json({
        url: icon.svgUrl,
        message: '需要付费解锁',
        requiresPayment: !generation.paid,
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}