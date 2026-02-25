// src/app/api/generate/[id]/route.ts
// 查询生成状态 API

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const generation = await prisma.generation.findUnique({
      where: { id },
      include: {
        results: true,
      },
    })

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: generation.id,
        status: generation.status,
        appName: generation.appName,
        description: generation.description,
        style: generation.style,
        results: generation.results.map((r: {
          id: string
          imageUrl: string
          svgUrl: string | null
          thumbUrl: string | null
          prompt: string
          seed: number | null
        }) => ({
          id: r.id,
          imageUrl: r.imageUrl,
          svgUrl: r.svgUrl,
          thumbUrl: r.thumbUrl,
          prompt: r.prompt,
          seed: r.seed,
        })),
        selectedId: generation.selectedId,
        paid: generation.paid,
        error: generation.error,
        createdAt: generation.createdAt,
      },
    })
  } catch (error) {
    console.error('Get generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}