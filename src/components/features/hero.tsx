// src/components/features/hero.tsx
// Hero 区域

import { Sparkles, Zap, Download } from 'lucide-react'

export function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-6 py-20 px-4 text-center md:py-32">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
        <Sparkles className="h-4 w-4" />
        <span>AI 驱动的 App 图标生成器</span>
      </div>
      
      {/* Title */}
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          30 秒生成
        </span>
        <br />
        <span>可上架的 App 图标</span>
      </h1>
      
      {/* Description */}
      <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
        输入 App 名称和描述，AI 自动生成 4 个专业图标方案。
        一键导出 iOS、Android、小程序全平台规格，立即可用。
      </p>
      
      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="#generator"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-lg font-medium text-primary-foreground shadow transition hover:opacity-90"
        >
          <Zap className="mr-2 h-5 w-5" />
          立即生成
        </a>
        <a
          href="#pricing"
          className="inline-flex h-12 items-center justify-center rounded-full border bg-background px-8 text-lg font-medium shadow-sm transition hover:bg-muted/50"
        >
          <Download className="mr-2 h-5 w-5" />
          查看定价
        </a>
      </div>
      
      {/* Stats */}
      <div className="mt-8 flex gap-8 text-center">
        <div>
          <div className="text-3xl font-bold">10s</div>
          <div className="text-sm text-muted-foreground">生成时间</div>
        </div>
        <div>
          <div className="text-3xl font-bold">50+</div>
          <div className="text-sm text-muted-foreground">图标规格</div>
        </div>
        <div>
          <div className="text-3xl font-bold">6</div>
          <div className="text-sm text-muted-foreground">风格可选</div>
        </div>
      </div>
    </section>
  )
}