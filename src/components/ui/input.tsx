import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { FieldError, FieldErrorIcon, FieldHint, FieldLabelText, type RequiredIndicator } from '@/components/ui/field'
import { cn } from '@/lib/utils'

/** IDSK text inputs come in two heights: L 48px and M 40px. */
export type InputSize = 'm' | 'l'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: ReactNode
  /** Supporting text displayed between the label and the input. */
  hint?: ReactNode
  /** Supporting text displayed below the input. */
  description?: ReactNode
  error?: ReactNode
  optional?: boolean
  /** Show the mandatory marker as a red asterisk (default) or as "(povinné pole)". */
  requiredIndicator?: RequiredIndicator
  size?: InputSize
  /** @deprecated Use `size="m"`. */
  small?: boolean
  /** Tooltip mark rendered after the label, see `InfoTooltip`. */
  tooltip?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      className,
      id,
      label,
      hint,
      description,
      error,
      optional,
      required,
      requiredIndicator,
      size = 'l',
      small,
      tooltip,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hintId = hint ? `${inputId}-hint` : undefined
    const descriptionId = description ? `${inputId}-description` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const describedBy = [ariaDescribedBy, hintId, descriptionId, errorId]
      .filter(Boolean)
      .join(' ') || undefined
    const resolvedSize: InputSize = small ? 'm' : size

    return (
      <div className="flex w-full flex-col">
        <div className={cn('flex items-center gap-[5px]', !hint && 'mb-[5px]')}>
          <label
            className={cn(
              'block text-foreground',
              resolvedSize === 'l' ? 'text-[19px] leading-7' : 'text-[16px] leading-6',
              disabled && 'text-foreground-muted',
            )}
            htmlFor={inputId}
          >
            <FieldLabelText size={resolvedSize} optional={optional} required={required} requiredIndicator={requiredIndicator}>
              {label}
            </FieldLabelText>
          </label>
          {tooltip}
        </div>
        {hint ? (
          <FieldHint className={cn('mb-[5px]', resolvedSize === 'm' && 'text-[16px] leading-6')} id={hintId}>
            {hint}
          </FieldHint>
        ) : null}
        <div className="relative flex w-full">
          <input
            aria-describedby={describedBy}
            aria-invalid={error ? true : ariaInvalid}
            aria-required={required || undefined}
            className={cn(
              'tracking-[0.5px] w-full rounded-[5px] border-2 border-border-strong bg-white px-[15px] text-foreground outline-none transition-[box-shadow,border-color] placeholder:text-foreground-muted',
              'hover:ring-[5px] hover:ring-foreground-muted focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
              'disabled:cursor-not-allowed disabled:border-border-muted disabled:bg-white disabled:text-foreground-muted disabled:hover:ring-0',
              resolvedSize === 'l'
                ? 'h-12 text-[19px] leading-7'
                : 'h-10 text-[16px] leading-6',
              error && 'border-error pr-12',
              className,
            )}
            disabled={disabled}
            id={inputId}
            ref={ref}
            required={required}
            {...props}
          />
          {error ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 z-10 -translate-y-1/2 text-error"
            >
              <FieldErrorIcon />
            </span>
          ) : null}
        </div>
        {description ? (
          <FieldHint className={cn('mt-[5px]', resolvedSize === 'm' && 'text-[16px] leading-6')} id={descriptionId}>
            {description}
          </FieldHint>
        ) : null}
        {error ? (
          <FieldError className={cn('mt-[5px]', resolvedSize === 'm' && 'text-[16px] leading-6')} id={errorId}>
            {error}
          </FieldError>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
