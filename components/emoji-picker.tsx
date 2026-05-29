'use client'

import { EMOJIS } from '@/lib/emojis'
import { cn } from '@/lib/utils'

interface EmojiPickerProps {
  onPick: (index: number) => void
  disabled?: boolean
}

export const EmojiPicker = ({ onPick, disabled }: EmojiPickerProps) => {
  return (
    <div className="flex w-full gap-1 px-4 pt-2">
      {EMOJIS.map((emoji, index) => (
        <button
          key={index}
          type="button"
          disabled={disabled}
          onClick={() => onPick(index)}
          aria-label={`Send reaction ${emoji}`}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-base leading-none',
            'transition-transform hover:scale-110 hover:bg-accent active:scale-95',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
