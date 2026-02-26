// src/lib/replicate.ts
// Replicate API 集成

import Replicate from 'replicate'

// 初始化 Replicate 客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

// 模型配置 - 使用免费模型
// 免费模型列表：https://replicate.com/pricing
const FLUX_MODEL = 'google/imagen-4' // 免费！谷歌最新模型
// const FLUX_MODEL = 'black-forest-labs/flux-1.1-pro' // 付费，高质量
// const FLUX_MODEL = 'black-forest-labs/flux-schnell' // 付费，快速
// const FLUX_MODEL = 'ideogram-ai/ideogram-v3-turbo' // 免费，适合文字

export interface GenerateIconOptions {
  prompt: string
  negativePrompt?: string
  seed?: number
  width?: number
  height?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

/**
 * 使用 Google Imagen 4 模型生成图标（免费）
 */
export async function generateIcon(
  options: GenerateIconOptions
): Promise<GenerateIconResult> {
  const { prompt, negativePrompt, seed } = options

  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  try {
    const output = await replicate.run(
      FLUX_MODEL,
      {
        input: {
          prompt,
          negative_prompt: negativePrompt || '',
          num_outputs: 1,
          seed: seedValue,
        },
      }
    ) as string[]

    const imageUrl = Array.isArray(output) ? output[0] : output

    return {
      imageUrl,
      seed: seedValue,
    }
  } catch (error: any) {
    console.error('Replicate API error:', error)
    throw new Error(`Failed to generate icon: ${error.message}`)
  }
}

/**
 * 批量生成多个图标变体
 */
export async function generateIconVariations(
  prompts: Array<{ prompt: string; negativePrompt: string; variation: number }>,
  options: {
    onProgress?: (completed: number, total: number) => void
  } = {}
): Promise<GenerateIconResult[]> {
  const results: GenerateIconResult[] = []
  const total = prompts.length

  for (let i = 0; i < prompts.length; i++) {
    const p = prompts[i]
    const result = await generateIcon({
      prompt: p.prompt,
      negativePrompt: p.negativePrompt,
    })
    results.push(result)

    if (options.onProgress) {
      options.onProgress(i + 1, total)
    }
  }

  return results
}

/**
 * 检查 Replicate API 是否可用
 */
export async function checkReplicateHealth(): Promise<boolean> {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return false
    }
    // 简单的健康检查
    return true
  } catch {
    return false
  }
}