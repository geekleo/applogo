// src/app/page.tsx
// 首页 - Icon Generator

import { Header } from '@/components/features/header'
import { IconGenerator } from '@/components/features/icon-generator'
import { Hero } from '@/components/features/hero'
import { Features } from '@/components/features/features'
import { Pricing } from '@/components/features/pricing'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Main Generator */}
      <section id="generator" className="container mx-auto max-w-7xl py-16 px-4 md:px-6">
        <IconGenerator />
      </section>
      
      {/* Features */}
      <Features />
      
      {/* Pricing */}
      <Pricing />
      
      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 AppIcon. Ship your app, we handle the icon.</p>
      </footer>
    </main>
  )
}