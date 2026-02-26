// src/lib/replicate.ts
// Replicate API 集成
// 文档：https://replicate.com/docs
// 价格：https://replicate.com/pricing

import Replicate from 'replicate'

// 初始化 Replicate 客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

// 模型配置 - 使用有免费额度的模型
// Replicate 新用户有$5免费额度
const FLUX_MODEL = 'black-forest-labs/flux-schnell' // 快速，便宜

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

/**
 * 使用 Flux Schnell 模型生成图标（快速且便宜）
 * 新用户有$5免费额度，可以生成约 600 次
 */
export async function generateIcon(
  options: GenerateIconOptions
): Promise<GenerateIconResult> {
  const { prompt, seed } = options
  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('Replicate API Token 未配置')
  }

  try {
    const output = await replicate.run(
      FLUX_MODEL,
      {
        input: {
          prompt: prompt,
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