import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * How a mandatory field is marked. IDSK offers a red asterisk (default) or
 * the text "(povinné pole)". Optional fields are marked with "(nepovinné pole)".
 */
export type RequiredIndicator = 'asterisk' | 'text'

type FieldLabelTextProps = {
  size?: 'm' | 'l'
  children: ReactNode
  optional?: boolean
  /** Custom optional text, e.g. "(nepovinné prílohy)" for file uploads. */
  optionalText?: ReactNode
  required?: boolean
  requiredIndicator?: RequiredIndicator
  /**
   * Id of the span wrapping the label text and its marker. Point `aria-labelledby`
   * at it when a tooltip mark sits inside the same label or legend, so the
   * tooltip button does not become part of the field's accessible name.
   */
  textId?: string
  /** Tooltip mark rendered after the label, see `InfoTooltip`. */
  tooltip?: ReactNode
}

/** Red asterisk used by IDSK to mark a mandatory field: 24px regular, 5px after the label. */
export function RequiredMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('ml-[5px] align-middle text-[24px] leading-none font-normal text-error', className)}
    >
      *
    </span>
  )
}

/** Label content with the mandatory or optional marker and an optional tooltip slot. */
export function FieldLabelText({
  children,
  size = 'l',
  optional,
  optionalText = '(nepovinné pole)',
  required,
  requiredIndicator = 'asterisk',
  textId,
  tooltip,
}: FieldLabelTextProps) {
  return (
    <>
      <span className="tracking-[0.5px]" id={textId}>
        {children}
        {required ? (
          requiredIndicator === 'text' ? (
            <span className="ml-[5px] text-[16px] leading-6 font-normal text-foreground-muted">
              (povinné pole)
            </span>
          ) : (
            <RequiredMark className={size === 'm' ? 'text-[19px]' : undefined} />
          )
        ) : optional ? (
          <span className="ml-[5px] text-[16px] leading-6 font-normal text-foreground-muted">
            {optionalText}
          </span>
        ) : null}
      </span>
      {tooltip ? <span className="ml-[5px] inline-flex align-middle">{tooltip}</span> : null}
    </>
  )
}

/** Supporting text under a label. Hint text style is 19/28 in N600. */
/** Filled Material "warning" icon used inside error states of fields. */
export function FieldErrorIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('size-5', className)} fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M12 2 1 21h22L12 2Zm1 16h-2v-2h2v2Zm0-4h-2V9h2v5Z" />
    </svg>
  )
}

export function FieldHint({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <span className={cn('block tracking-[0.5px] text-[19px] leading-7 text-foreground-muted', className)} {...props} />
}

type FieldErrorProps = HTMLAttributes<HTMLElement> & {
  /** Screen reader only prefix; IDSK does not render it visually. */
  prefix?: string
}

/** Error message in Error alert red with a visually hidden "Chyba:" prefix. */
export function FieldError({ children, className, prefix = 'Chyba: ', ...props }: FieldErrorProps) {
  return (
    <span className={cn('block tracking-[0.5px] text-[19px] leading-7 text-error', className)} {...props}>
      <span className="sr-only">{prefix}</span>
      {children}
    </span>
  )
}
