// src/lib/openrouter.ts
// OpenRouter API 集成
// 文档：https://openrouter.ai/docs

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

/**
 * 使用 OpenRouter 调用图像生成模型
 * OpenRouter 主要提供文本模型，图像生成需要通过特定模型
 * 文档：https://openrouter.ai/models?category=image-generation
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

    // OpenRouter 标准 API endpoint
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://applogo.vercel.app',
        'X-Title': 'AppIcon',
      },
      body: JSON.stringify({
        // 使用支持图像生成的模型
        // OpenRouter 上的图像生成模型列表：https://openrouter.ai/models?category=image-generation
        model: 'stability-ai/stable-diffusion-xl',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        // 请求图像输出
        response_format: { type: 'image_url' },
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
    
    // OpenRouter 返回格式
    const imageUrl = data.choices?.[0]?.message?.content || 
                     data.choices?.[0]?.image_url?.url

    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.error('OpenRouter response:', data)
      throw new Error('未返回有效的图片 URL，OpenRouter 可能不支持该模型')
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