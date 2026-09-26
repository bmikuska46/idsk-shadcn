import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type MandatoryFieldLegendProps = HTMLAttributes<HTMLParagraphElement> & {
  /** Text before the asterisk. */
  before?: ReactNode
  /** Text after the asterisk. */
  after?: ReactNode
}

/**
 * IDSK "Legenda povinných polí". Place it above the form content on every
 * page that contains at least one mandatory field, so users learn what the
 * red asterisk means before they meet it.
 */
export function MandatoryFieldLegend({
  after = ')',
  before = 'Povinné polia sú označené hviezdičkou (',
  className,
  ...props
}: MandatoryFieldLegendProps) {
  return (
    <p className={cn('py-2 text-[16px] leading-6 text-foreground-muted', className)} {...props}>
      {before}
      <span className="text-error">*</span>
      {after}
    </p>
  )
}
