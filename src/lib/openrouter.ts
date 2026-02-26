// src/lib/openrouter.ts
// OpenRouter API 集成
// 文档：https://openrouter.ai/docs
// 图像生成：https://openrouter.ai/docs/images

export interface GenerateIconOptions {
  prompt: string
  seed?: number
}

export interface GenerateIconResult {
  imageUrl: string
  seed: number
}

/**
 * 使用 OpenRouter + Stability AI SDXL 生成图标
 * 价格：$0.002/张（约￥0.014）
 * 文档：https://openrouter.ai/docs/images
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

    // OpenRouter 图像生成 API
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://applogo.vercel.app',
        'X-Title': 'AppIcon',
      },
      body: JSON.stringify({
        model: 'stability-ai/stable-diffusion-xl',
        prompt: prompt,
        width: 1024,
        height: 1024,
        seed: seedValue,
        response_format: 'url',
        n: 1,
      }),
    })

    console.log('OpenRouter API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error response:', errorText)
      
      // 尝试解析 JSON 错误
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(`OpenRouter API 错误 (${response.status}): ${errorJson.error?.message || errorText}`)
      } catch {
        throw new Error(`OpenRouter API 错误 (${response.status}): ${errorText.substring(0, 500)}`)
      }
    }

    const data = await response.json()
    console.log('OpenRouter response data:', JSON.stringify(data, null, 2))
    
    // OpenRouter 图像生成返回格式
    // {
    //   "data": [
    //     {
    //       "url": "https://..."
    //     }
    //   ]
    // }
    const imageUrl = data.data?.[0]?.url || data.data?.[0]?.image_url

    if (!imageUrl) {
      console.error('OpenRouter response:', data)
      throw new Error('未返回图片 URL，请检查 OpenRouter 配置和模型是否可用')
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
      throw new Error('OpenRouter API Key 无效，请检查配置')
    }
    
    if (error.message?.includes('404')) {
      throw new Error('OpenRouter API endpoint 不存在')
    }
    
    throw new Error(`生成失败：${error.message}`)
  }
}