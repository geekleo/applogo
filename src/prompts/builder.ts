// src/prompts/builder.ts
// Prompt 构建器

import type { IconStyle } from '@/types'
import { PROMPT_STYLES, TECHNICAL_CONSTRAINTS, UNIVERSAL_NEGATIVE_PROMPT } from './styles'

/**
 * 构建图标生成 Prompt
 */
export function buildIconPrompt(
  appName: string,
  description: string,
  style: IconStyle,
  options: {
    variation?: number // 变体编号 1-4
    seed?: number // 随机种子
  } = {}
): {
  prompt: string
  negativePrompt: string
} {
  const { variation = 0 } = options
  const styleConfig = PROMPT_STYLES[style]

  // 变体提示词（增加多样性）
  const variationPrompts = [
    '',
    'alternative layout, different angle, creative variation',
    'different emphasis, unique perspective, artistic interpretation',
    'bold approach, distinctive design, standout version',
  ]

  // 构建主 Prompt
  const prompt = [
    // 风格前缀
    styleConfig.prefix,
    
    // 应用信息
    `App icon for mobile application named "${appName}"`,
    `App description: ${description}`,
    
    // 风格后缀
    styleConfig.suffix,
    
    // 技术约束
    ...TECHNICAL_CONSTRAINTS,
    
    // 变体提示
    variation > 0 ? variationPrompts[variation] : '',
    
    // 最终强调
    'Generate a single, polished app icon design',
  ]
    .filter(Boolean)
    .join('. ')

  return {
    prompt,
    negativePrompt: UNIVERSAL_NEGATIVE_PROMPT,
  }
}

/**
 * 批量构建多个变体 Prompt
 */
export function buildPromptVariations(
  appName: string,
  description: string,
  style: IconStyle,
  count: number = 4
): Array<{ prompt: string; negativePrompt: string; variation: number }> {
  return Array.from({ length: count }, (_, i) => ({
    ...buildIconPrompt(appName, description, style, { variation: i }),
    variation: i,
  }))
}

/**
 * 构建优化 Prompt（用于重新生成）
 */
export function buildRefinementPrompt(
  originalPrompt: string,
  feedback: string
): string {
  return `${originalPrompt}. User feedback: ${feedback}. Improve the design based on this feedback while maintaining the original style and quality.`
}

/**
 * 风格迁移 Prompt（保持图标内容，更换风格）
 */
export function buildStyleTransferPrompt(
  currentStyle: IconStyle,
  targetStyle: IconStyle,
  originalPrompt: string
): string {
  const currentConfig = PROMPT_STYLES[currentStyle]
  const targetConfig = PROMPT_STYLES[targetStyle]

  // 移除当前风格关键词，添加目标风格
  let refinedPrompt = originalPrompt
  currentConfig.keywords.forEach((keyword) => {
    refinedPrompt = refinedPrompt.replace(new RegExp(keyword, 'gi'), '')
  })

  return `${targetConfig.prefix}. ${refinedPrompt}. ${targetConfig.suffix}`
}