// src/components/features/features.tsx
// 功能展示区

import { Zap, Smartphone, Palette, Download, Shield, Clock } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: '10 秒生成',
    description: 'AI 快速生成 4 个图标方案，无需等待',
  },
  {
    icon: Smartphone,
    title: '全平台适配',
    description: 'iOS、Android、小程序、Web 全套规格一键导出',
  },
  {
    icon: Palette,
    title: '6 种风格',
    description: '极简、渐变、像素、3D、霓虹、手绘任你选择',
  },
  {
    icon: Download,
    title: '一键打包',
    description: '50+ 尺寸规格自动生成，SVG 矢量源文件可选',
  },
  {
    icon: Shield,
    title: '商业可用',
    description: '生成的图标完全属于你，可商业使用无版权风险',
  },
  {
    icon: Clock,
    title: '永久下载',
    description: '购买后永久保存，随时重新下载无时间限制',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t bg-muted/30 py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            为什么选择 AppIcon？
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            专为独立开发者打造，让你的 App 拥有专业级图标
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}