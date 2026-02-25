// src/app/api/user/generations/route.ts
// 用户历史记录 API

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 确保用户存在于数据库
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.firstName || user.username || '',
          image: user.imageUrl,
        },
      })
    }

    // 获取生成记录
    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where: { userId: user.id },
        include: {
          results: {
            take: 1, // 只取第一个作为预览
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.generation.count({
        where: { userId: user.id },
      }),
    ])

    return NextResponse.json({
      success: true,
      items: generations,
      total,
      page,
      limit,
      hasMore: total > page * limit,
    })
  } catch (error) {
    console.error('Get generations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}