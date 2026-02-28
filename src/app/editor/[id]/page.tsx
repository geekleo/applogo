// src/app/editor/[id]/page.tsx
// 图标编辑页面

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { IconEditor } from '@/components/editor/icon-editor'

interface EditorPageProps {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params }: EditorPageProps) {
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

  // 使用第一个结果作为编辑图片
  const imageUrl = generation.results[0]?.imageUrl

  if (!imageUrl) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">编辑图标</h1>
          <p className="text-muted-foreground mt-1">
            编辑 App 名称：{generation.appName}
          </p>
        </div>

        <IconEditor
          imageUrl={imageUrl}
          appName={generation.appName}
          onExport={async (dataUrl) => {
            // 这里可以保存编辑后的图片
            // 目前先返回到结果页
            window.location.href = `/result/${id}?edited=1`
          }}
          onCancel={() => {
            window.history.back()
          }}
        />
      </div>
    </main>
  )
}
