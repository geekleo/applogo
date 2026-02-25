// src/components/features/style-selector.tsx
// 风格选择器

'use client'

import { cn } from '@/lib/utils'
import type { StyleConfig, IconStyle } from '@/types'

interface StyleSelectorProps {
  styles: StyleConfig[]
  selected: IconStyle
  onChange: (style: IconStyle) => void
  disabled?: boolean
}

export function StyleSelector({
  styles,
  selected,
  onChange,
  disabled,
}: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {styles.map((style) => (
        <button
          key={style.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(style.id)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
            selected === style.id
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className="text-2xl">{style.icon}</span>
          <span className="text-sm font-medium">{style.name}</span>
          <span className="text-xs text-muted-foreground">{style.description}</span>
        </button>
      ))}
    </div>
  )
}