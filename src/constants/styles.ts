// src/constants/styles.ts
// 图标风格配置

import type { StyleConfig } from '@/types'

export const ICON_STYLES: StyleConfig[] = [
  {
    id: 'minimal',
    name: '极简风格',
    nameEn: 'Minimal',
    icon: '◇',
    description: '简洁线条，单色或双色，适合工具类 App',
    promptPrefix: 'minimalist app icon, simple geometric shapes, clean lines, single or two colors, flat design, no gradients, no shadows, professional, modern',
    examples: ['calculator', 'clock', 'weather'],
  },
  {
    id: 'gradient',
    name: '渐变风格',
    nameEn: 'Gradient',
    icon: '◈',
    description: '现代渐变，色彩丰富，适合消费类 App',
    promptPrefix: 'modern app icon, vibrant gradient colors, smooth color transitions, glossy finish, iOS style, professional, eye-catching, vibrant',
    examples: ['social', 'music', 'photo'],
  },
  {
    id: 'pixel',
    name: '像素风格',
    nameEn: 'Pixel',
    icon: '▤',
    description: '复古像素，适合游戏或怀旧 App',
    promptPrefix: 'pixel art app icon, 8-bit style, retro gaming aesthetic, limited color palette, nostalgic, blocky pixels, cute, game-like',
    examples: ['game', 'arcade', 'retro'],
  },
  {
    id: '3d',
    name: '3D 立体',
    nameEn: '3D',
    icon: '◆',
    description: '立体质感，现代感强，适合各类 App',
    promptPrefix: '3D app icon, dimensional design, soft shadows, realistic materials, isometric perspective, modern, polished, depth, volumetric lighting',
    examples: ['finance', 'productivity', 'utility'],
  },
  {
    id: 'neon',
    name: '霓虹风格',
    nameEn: 'Neon',
    icon: '✧',
    description: '赛博朋克，发光效果，适合音乐/社交 App',
    promptPrefix: 'neon app icon, glowing effects, cyberpunk aesthetic, vibrant neon colors, dark background, futuristic, electric, nightlife vibe',
    examples: ['music', 'social', 'entertainment'],
  },
  {
    id: 'handdrawn',
    name: '手绘风格',
    nameEn: 'Hand Drawn',
    icon: '✎',
    description: '手绘质感，温暖亲切，适合生活类 App',
    promptPrefix: 'hand-drawn app icon, sketchy style, watercolor texture, warm colors, organic shapes, artistic, cute, friendly, illustrated',
    examples: ['lifestyle', 'food', 'health'],
  },
]

export const getStyleById = (id: string): StyleConfig | undefined => {
  return ICON_STYLES.find((style) => style.id === id)
}

export const DEFAULT_STYLE = 'gradient'