// src/components/features/header.tsx
// 顶部导航栏

'use client'

import Link from 'next/link'
import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { Sparkles, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Header() {
  const { isSignedIn, isLoaded } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AppIcon</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            功能
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            定价
          </Link>
          {isSignedIn && (
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              我的图标
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoaded ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/#generator">
                <Button size="sm">生成图标</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">注册</Button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="#features"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              功能
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              定价
            </Link>
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                我的图标
              </Link>
            )}
          </nav>
          
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            {!isLoaded ? null : isSignedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">已登录</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    登录
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">注册</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}