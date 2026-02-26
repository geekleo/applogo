// src/lib/replicate.ts
// Replicate API 集成

import Replicate from 'replicate'

// 初始化 Replicate 客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

// 模型配置 - 使用有免费额度的模型
// Replicate 免费模型：https://replicate.com/pricing
// 新用户有 $5 免费额度，可以使用任何模型
const FLUX_MODEL = 'black-forest-labs/flux-schnell' // 快速，便宜，有免费额度
// const FLUX_MODEL = 'black-forest-labs/flux-1.1-pro' // 高质量
// const FLUX_MODEL = 'stability-ai/sdxl' // 免费模型之一

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
 * 使用 Flux Schnell 模型生成图标（快速且便宜）
 * 新用户有$5免费额度，可以生成约600次
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
          prompt_strength: 0.8,
          num_inference_steps: 4, // Schnell 只需要 4 步，很快
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
    
    // 更详细的错误信息
    if (error.message?.includes('timeout')) {
      throw new Error('生成超时，请稍后重试')
    }
    if (error.message?.includes('billing') || error.message?.includes('credits') || error.message?.includes('balance')) {
      throw new Error('Replicate API 余额不足，请充值：https://replicate.com/account/billing')
    }
    
    throw new Error(`生成失败：${error.message}`)
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