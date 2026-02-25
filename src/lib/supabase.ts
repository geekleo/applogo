// src/lib/supabase.ts
// Supabase 客户端配置

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 浏览器端客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端客户端（需要 service_role key）
export function getServerSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey)
}

// 存储 Bucket 名称
export const STORAGE_BUCKET = 'appicon'

/**
 * 上传文件到 Supabase Storage
 */
export async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string = 'image/png'
): Promise<string> {
  const serverSupabase = getServerSupabase()
  
  const { data, error } = await serverSupabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error('Upload error:', error)
    throw error
  }

  // 获取公共 URL
  const { data: urlData } = serverSupabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * 从 Storage 删除文件
 */
export async function deleteFromStorage(path: string): Promise<void> {
  const serverSupabase = getServerSupabase()
  
  await serverSupabase.storage
    .from(STORAGE_BUCKET)
    .remove([path])
}

/**
 * 生成图标存储路径
 */
export function getIconPath(generationId: string, index: number): string {
  return `icons/${generationId}/${index}.png`
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