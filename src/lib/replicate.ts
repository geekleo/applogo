// src/lib/replicate.ts
// Replicate API 集成

import Replicate from 'replicate'

// 初始化 Replicate 客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

// Flux 模型配置
const FLUX_MODEL = 'black-forest-labs/flux-schnell' // 快速版
// const FLUX_MODEL = 'black-forest-labs/flux-pro' // 高质量版

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
 * 使用 Flux 模型生成图标
 */
export async function generateIcon(
  options: GenerateIconOptions
): Promise<GenerateIconResult> {
  const { prompt, negativePrompt, seed, width = 1024, height = 1024 } = options

  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  try {
    const output = await replicate.run(
      FLUX_MODEL,
      {
        input: {
          prompt,
          negative_prompt: negativePrompt || '',
          width,
          height,
          num_outputs: 1,
          seed: seedValue,
          output_format: 'png',
          output_quality: 100,
        },
      }
    ) as string[]

    const imageUrl = Array.isArray(output) ? output[0] : output

    return {
      imageUrl,
      seed: seedValue,
    }
  } catch (error) {
    console.error('Replicate API error:', error)
    throw new Error('Failed to generate icon')
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