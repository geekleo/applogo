// src/lib/openrouter.ts
// OpenRouter API 集成
// 文档：https://openrouter.ai/docs
// 价格：https://openrouter.ai/models

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

// 模型配置 - 低成本图像生成模型
// OpenRouter 主要提供文本模型，图像生成需要使用特定的 endpoint
// 推荐使用 Stability AI 或 DALL-E 3
const IMAGE_MODEL = 'stability-ai/stable-diffusion-xl' // 低成本
// const IMAGE_MODEL = 'dall-e-3' // 高质量但较贵

/**
 * 使用 OpenRouter 生成图标
 */
export async function generateIcon(
  options: GenerateIconOptions
): Promise<GenerateIconResult> {
  const { prompt, seed } = options
  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenRouter API Key 未配置')
  }

  try {
    // OpenRouter 图像生成 API
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://applogo.vercel.app', // 必填
        'X-Title': 'AppIcon', // 可选
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || '生成失败')
    }

    const data = await response.json()
    const imageUrl = data.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('未返回图片 URL')
    }

    return {
      imageUrl,
      seed: seedValue,
    }
  } catch (error: any) {
    console.error('OpenRouter API error:', error)
    
    if (error.message?.includes('billing') || error.message?.includes('credits') || error.message?.includes('balance')) {
      throw new Error('OpenRouter 余额不足，请充值：https://openrouter.ai/credits')
    }
    
    throw new Error(`生成失败：${error.message}`)
  }
}