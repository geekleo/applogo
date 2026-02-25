// src/lib/sharp-utils.ts
// 图像处理工具

import sharp from 'sharp'
import type { IconSpec } from '@/types'
import { IOS_SPECS, ANDROID_SPECS, WECHAT_SPECS, WEB_SPECS } from '@/constants'

/**
 * 调整图像尺寸
 */
export async function resizeImage(
  buffer: Buffer,
  size: number,
  options: {
    fit?: 'contain' | 'cover' | 'inside' | 'outside'
    background?: sharp.Color
  } = {}
): Promise<Buffer> {
  const { fit = 'contain', background = { r: 0, g: 0, b: 0, alpha: 0 } } = options

  return sharp(buffer)
    .resize(size, size, {
      fit,
      background,
    })
    .png()
    .toBuffer()
}

/**
 * 应用圆角
 */
export async function applyRoundedCorners(
  buffer: Buffer,
  radius: number
): Promise<Buffer> {
  const image = sharp(buffer)
  const metadata = await image.metadata()
  const width = metadata.width || 512
  const height = metadata.height || 512

  // 创建圆角蒙版
  const roundedCorner = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}"/></svg>`
  )

  return image
    .composite([
      {
        input: roundedCorner,
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer()
}

/**
 * 应用圆形裁切
 */
export async function applyCircleMask(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer)
  const metadata = await image.metadata()
  const size = Math.min(metadata.width || 512, metadata.height || 512)

  // 创建圆形蒙版
  const circle = Buffer.from(
    `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
  )

  return image
    .resize(size, size)
    .composite([
      {
        input: circle,
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer()
}

/**
 * 添加水印
 */
export async function addWatermark(
  buffer: Buffer,
  text: string = 'Made with AppIcon'
): Promise<Buffer> {
  const image = sharp(buffer)
  const metadata = await image.metadata()
  const width = metadata.width || 512
  const height = metadata.height || 512

  // 创建水印 SVG
  const watermark = Buffer.from(`
    <svg width="${width}" height="${height}">
      <text
        x="${width / 2}"
        y="${height - 20}"
        text-anchor="middle"
        font-family="Arial"
        font-size="16"
        fill="rgba(255,255,255,0.5)"
      >${text}</text>
    </svg>
  `)

  return image
    .composite([
      {
        input: watermark,
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer()
}

/**
 * 批量生成多种尺寸
 */
export async function generateSizes(
  sourceBuffer: Buffer,
  specs: IconSpec[]
): Promise<{ spec: IconSpec; buffer: Buffer }[]> {
  const results: { spec: IconSpec; buffer: Buffer }[] = []

  for (const spec of specs) {
    let buffer = await resizeImage(sourceBuffer, spec.size)

    // 应用蒙版
    if (spec.mask === 'circle') {
      buffer = await applyCircleMask(buffer)
    } else if (spec.mask === 'rounded') {
      buffer = await applyRoundedCorners(buffer, spec.size * 0.2) // 20% 圆角
    }

    results.push({ spec, buffer })
  }

  return results
}

/**
 * 生成平台图标包
 */
export async function generatePlatformPack(
  sourceBuffer: Buffer,
  platforms: ('ios' | 'android' | 'wechat' | 'web')[]
): Promise<{ path: string; buffer: Buffer; spec: IconSpec }[]> {
  const allSpecs: IconSpec[] = []

  if (platforms.includes('ios')) {
    allSpecs.push(...IOS_SPECS)
  }
  if (platforms.includes('android')) {
    allSpecs.push(...ANDROID_SPECS)
  }
  if (platforms.includes('wechat')) {
    allSpecs.push(...WECHAT_SPECS)
  }
  if (platforms.includes('web')) {
    allSpecs.push(...WEB_SPECS)
  }

  const results = await generateSizes(sourceBuffer, allSpecs)

  return results.map(({ spec, buffer }) => ({
    path: `${spec.platform}/${spec.name}-${spec.size}x${spec.size}.png`,
    buffer,
    spec,
  }))
}

/**
 * 获取图像元数据
 */
export async function getImageMetadata(buffer: Buffer): Promise<{
  width: number
  height: number
  format: string
}> {
  const metadata = await sharp(buffer).metadata()
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
  }
}

/**
 * 转换为 WebP
 */
export async function toWebP(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).webp({ quality: 90 }).toBuffer()
}