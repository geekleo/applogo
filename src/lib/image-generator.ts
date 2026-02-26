// src/lib/image-generator.ts
// 图像生成服务 - 支持多个提供商
// 优先级：Stability AI > Replicate > OpenRouter

import Replicate from 'replicate'

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
  provider: 'stability' | 'replicate' | 'openrouter'
}

/**
 * 使用 Replicate 生成图标（最稳定）
 */
async function generateWithReplicate(options: GenerateIconOptions): Promise<GenerateIconResult> {
  const { prompt, seed } = options
  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || '',
  })

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          prompt_strength: 0.8,
          num_inference_steps: 4,
          seed: seedValue,
        },
      }
    ) as string[]

    const imageUrl = Array.isArray(output) ? output[0] : output

    return {
      imageUrl,
      seed: seedValue,
      provider: 'replicate',
    }
  } catch (error: any) {
    console.error('Replicate error:', error)
    throw new Error(`Replicate 生成失败：${error.message}`)
  }
}

/**
 * 使用 OpenRouter 生成图标
 */
async function generateWithOpenRouter(options: GenerateIconOptions): Promise<GenerateIconResult> {
  const { prompt, seed } = options
  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenRouter API Key 未配置')
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://applogo.vercel.app',
        'X-Title': 'AppIcon',
      },
      body: JSON.stringify({
        model: 'stability-ai/stable-diffusion-xl',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'image_url' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API 错误 (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const imageUrl = data.choices?.[0]?.message?.content || data.choices?.[0]?.image_url?.url

    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('OpenRouter 未返回有效的图片 URL')
    }

    return {
      imageUrl,
      seed: seedValue,
      provider: 'openrouter',
    }
  } catch (error: any) {
    console.error('OpenRouter error:', error)
    throw new Error(`OpenRouter 生成失败：${error.message}`)
  }
}

/**
 * 智能选择提供商生成图标
 */
export async function generateIcon(options: GenerateIconOptions): Promise<GenerateIconResult> {
  // 优先使用 Replicate（最稳定）
  if (process.env.REPLICATE_API_TOKEN) {
    console.log('Using Replicate for image generation')
    return generateWithReplicate(options)
  }

  // 其次使用 OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    console.log('Using OpenRouter for image generation')
    return generateWithOpenRouter(options)
  }

  throw new Error('未配置任何图像生成 API，请设置 REPLICATE_API_TOKEN 或 OPENROUTER_API_KEY')
}