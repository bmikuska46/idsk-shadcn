import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  /** Render as decoration only (no separator semantics). */
  decorative?: boolean
}

/** IDSK divider: a 2px N600 rule with 5px rounded ends. */
export function Divider({ className, decorative = false, ...props }: DividerProps) {
  return (
    <hr
      aria-hidden={decorative || undefined}
      className={cn('my-idsk-3 h-0.5 w-full rounded-[5px] border-0 bg-foreground-muted', className)}
      role={decorative ? 'presentation' : undefined}
      {...props}
    />
  )
}
