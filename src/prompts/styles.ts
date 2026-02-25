// src/prompts/styles.ts
// Prompt 风格模板

import type { IconStyle } from '@/types'

export interface PromptStyleConfig {
  prefix: string
  suffix: string
  negativePrompt: string
  keywords: string[]
}

export const PROMPT_STYLES: Record<IconStyle, PromptStyleConfig> = {
  minimal: {
    prefix: 'minimalist app icon, simple geometric shapes, clean lines',
    suffix: 'flat design, professional, modern, vector style',
    negativePrompt: 'text, letters, words, complex, gradients, shadows, 3d, realistic, photo',
    keywords: ['minimal', 'simple', 'clean', 'geometric', 'modern', 'flat'],
  },
  gradient: {
    prefix: 'modern app icon, vibrant gradient colors, smooth color transitions',
    suffix: 'glossy finish, iOS style, professional, eye-catching, vibrant',
    negativePrompt: 'text, letters, words, flat, dull, boring, low quality, pixelated',
    keywords: ['gradient', 'vibrant', 'modern', 'glossy', 'iOS', 'colorful'],
  },
  pixel: {
    prefix: 'pixel art app icon, 8-bit style, retro gaming aesthetic',
    suffix: 'limited color palette, nostalgic, blocky pixels, cute, game-like',
    negativePrompt: 'text, letters, words, smooth, realistic, high resolution, 3d, modern',
    keywords: ['pixel', '8-bit', 'retro', 'game', 'nostalgic', 'cute'],
  },
  '3d': {
    prefix: '3D app icon, dimensional design, soft shadows, realistic materials',
    suffix: 'isometric perspective, modern, polished, depth, volumetric lighting',
    negativePrompt: 'text, letters, words, flat, 2d, sketch, cartoon, anime, photo',
    keywords: ['3d', 'dimensional', 'realistic', 'depth', 'isometric', 'polished'],
  },
  neon: {
    prefix: 'neon app icon, glowing effects, cyberpunk aesthetic',
    suffix: 'vibrant neon colors, dark background, futuristic, electric, nightlife vibe',
    negativePrompt: 'text, letters, words, daylight, natural, dull, flat, 2d',
    keywords: ['neon', 'glow', 'cyberpunk', 'futuristic', 'electric', 'night'],
  },
  handdrawn: {
    prefix: 'hand-drawn app icon, sketchy style, watercolor texture',
    suffix: 'warm colors, organic shapes, artistic, cute, friendly, illustrated',
    negativePrompt: 'text, letters, words, digital, perfect lines, vector, 3d, photo',
    keywords: ['hand-drawn', 'sketch', 'watercolor', 'artistic', 'warm', 'friendly'],
  },
}

// 技术约束（所有风格通用）
export const TECHNICAL_CONSTRAINTS = [
  'square format, 1:1 aspect ratio',
  'no text or letters in the icon',
  'centered composition',
  'clear, recognizable at small sizes',
  'works on both light and dark backgrounds',
  'professional quality, app store ready',
  'high resolution, sharp details',
]

// 负面提示词（通用）
export const UNIVERSAL_NEGATIVE_PROMPT = [
  'text',
  'letters',
  'words',
  'numbers',
  'watermark',
  'signature',
  'blurry',
  'low quality',
  'distorted',
  'deformed',
  'ugly',
  'bad proportions',
].join(', ')