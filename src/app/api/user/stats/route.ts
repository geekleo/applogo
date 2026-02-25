// src/app/api/user/stats/route.ts
// 用户统计 API

import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 获取统计数据
    const [totalGenerations, paidGenerations, dbUser] = await Promise.all([
      prisma.generation.count({
        where: { userId: user.id },
      }),
      prisma.generation.count({
        where: { userId: user.id, paid: true },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { freeCredits: true },
      }),
    ])

    return NextResponse.json({
      totalGenerations,
      paidGenerations,
      freeCredits: dbUser?.freeCredits ?? 0,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}