// src/lib/openrouter.ts
// OpenRouter 图像生成 API
// 文档：https://openrouter.ai/docs/guides/overview/multimodal/image-generation

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

/**
 * 使用 OpenRouter 生成图标
 * 支持 Flux 等图像生成模型
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
    console.log('Calling OpenRouter API with prompt:', prompt.substring(0, 100))

    // OpenRouter 图像生成 API - 使用正确的 endpoint 和参数
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://applogo.vercel.app',
        'X-Title': 'AppIcon',
      },
      body: JSON.stringify({
        // 使用 Flux 模型（支持图像生成）
        model: 'black-forest-labs/flux.2-pro',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        // 关键：指定输出模态为图像
        modalities: ['image'],
        seed: seedValue,
      }),
    })

    console.log('OpenRouter API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error response:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(`OpenRouter API 错误 (${response.status}): ${errorJson.error?.message || errorText}`)
      } catch {
        throw new Error(`OpenRouter API 错误 (${response.status}): ${errorText.substring(0, 500)}`)
      }
    }

    const data = await response.json()
    console.log('OpenRouter response:', JSON.stringify(data, null, 2))
    
    // OpenRouter 图像生成返回格式
    // {
    //   "choices": [{
    //     "message": {
    //       "role": "assistant",
    //       "images": [{
    //         "type": "image_url",
    //         "image_url": {
    //           "url": "data:image/png;base64,..."
    //         }
    //       }]
    //     }
    //   }]
    // }
    const images = data.choices?.[0]?.message?.images
    
    if (!images || images.length === 0) {
      console.error('OpenRouter response:', data)
      throw new Error('未返回图片，请检查模型是否支持图像生成')
    }

    const imageUrl = images[0].image_url?.url

    if (!imageUrl) {
      throw new Error('未返回有效的图片 URL')
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
    
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('OpenRouter API Key 无效')
    }
    
    if (error.message?.includes('404')) {
      throw new Error('OpenRouter API endpoint 不存在或模型不可用')
    }
    
    throw new Error(`生成失败：${error.message}`)
  }
}