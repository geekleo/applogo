// src/app/result/[id]/page.tsx
// 生成结果详情页

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ResultView } from '@/components/features/result-view'

interface ResultPageProps {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params

  const generation = await prisma.generation.findUnique({
    where: { id },
    include: {
      results: true,
    },
  })

  if (!generation) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8 px-4 md:px-6">
        <ResultView generation={generation} />
      </div>
    </main>
  )
}