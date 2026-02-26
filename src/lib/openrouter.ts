// src/lib/openrouter.ts
// Stability AI 官方 API 集成
// 文档：https://platform.stability.ai/docs/api-reference
// 价格：https://stability.ai/pricing

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

/**
 * 使用 Stability AI SDXL 生成图标
 * 通过 Stability AI 官方 API
 */
export async function generateIcon(
  options: GenerateIconOptions
): Promise<GenerateIconResult> {
  const { prompt, seed } = options
  const seedValue = seed ?? Math.floor(Math.random() * 1000000)

  // 优先使用 Stability AI API Key，如果没有则使用 OpenRouter
  const stabilityApiKey = process.env.STABILITY_API_KEY
  const openRouterKey = process.env.OPENROUTER_API_KEY
  
  const apiKey = stabilityApiKey || openRouterKey
  
  if (!apiKey) {
    throw new Error('Stability AI API Key 或 OpenRouter API Key 未配置')
  }

  try {
    console.log('Calling Stability AI API with prompt:', prompt.substring(0, 100))

    // Stability AI 官方 API
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sdxl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'image/*',
      },
      body: JSON.stringify({
        prompt: prompt,
        output_format: 'png',
        seed: seedValue,
        mode: 'text-to-image',
        width: 1024,
        height: 1024,
      }),
    })

    console.log('Stability AI API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Stability AI API error response:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(`Stability AI API 错误 (${response.status}): ${errorJson.message || errorText}`)
      } catch {
        throw new Error(`Stability AI API 错误 (${response.status}): ${errorText.substring(0, 500)}`)
      }
    }

    // Stability AI 返回的是图片二进制数据
    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    
    // 返回 base64 格式的 data URL
    const imageUrl = `data:image/png;base64,${base64Image}`

    return {
      imageUrl,
      seed: seedValue,
    }
  } catch (error: any) {
    console.error('Stability AI API error:', error)
    
    if (error.message?.includes('billing') || error.message?.includes('credits') || error.message?.includes('balance')) {
      throw new Error('Stability AI 余额不足，请充值')
    }
    
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Stability AI API Key 无效')
    }
    
    if (error.message?.includes('404')) {
      throw new Error('Stability AI API endpoint 不存在')
    }
    
    throw new Error(`生成失败：${error.message}`)
  }
}