// src/lib/r2.ts
// Cloudflare R2 存储集成

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// R2 客户端配置
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'appicon'
const PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

/**
 * 上传文件到 R2
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string = 'image/png'
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return `${PUBLIC_URL}/${key}`
}

/**
 * 从 R2 获取文件
 */
export async function getFromR2(key: string): Promise<Buffer | null> {
  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    )

    if (!response.Body) {
      return null
    }

    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  } catch (error) {
    console.error('R2 get error:', error)
    return null
  }
}

/**
 * 删除 R2 文件
 */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  )
}

/**
 * 获取签名 URL（用于临时访问）
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return getSignedUrl(r2Client, command, { expiresIn })
}

/**
 * 生成图标存储路径
 */
export function getIconPath(generationId: string, index: number, ext: string = 'png'): string {
  return `icons/${generationId}/${index}.${ext}`
}

/**
 * 生成缩略图路径
 */
export function getThumbPath(generationId: string, index: number): string {
  return `icons/${generationId}/${index}-thumb.png`
}

/**
 * 生成打包文件路径
 */
export function getPackPath(generationId: string): string {
  return `packs/${generationId}/appicon-pack.zip`
}