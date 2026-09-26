'use client'

import {
  forwardRef,
  useId,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'

import { FieldError, FieldErrorIcon, FieldHint, FieldLabelText, type RequiredIndicator } from '@/components/ui/field'
import { cn } from '@/lib/utils'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode
  /** Supporting text displayed between the label and the textarea. */
  hint?: ReactNode
  /** Supporting text displayed below the textarea. */
  description?: ReactNode
  error?: ReactNode
  optional?: boolean
  /** Show the mandatory marker as a red asterisk (default) or as "(povinné pole)". */
  requiredIndicator?: RequiredIndicator
  counter?: boolean
  /** IDSK size: L uses 19px text, M uses 16px text. */
  size?: 'm' | 'l'
  /** Tooltip mark rendered after the label, see `InfoTooltip`. */
  tooltip?: ReactNode
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      disabled,
      maxLength,
      counter = true,
      onChange,
      defaultValue,
      size = 'l',
      tooltip,
      value,
      rows = 4,
      wrap = 'soft',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const hintId = hint ? `${textareaId}-hint` : undefined
    const descriptionId = description ? `${textareaId}-description` : undefined
    const errorId = error ? `${textareaId}-error` : undefined
    const hasCounter = counter && typeof maxLength === 'number'
    const limitId = hasCounter ? `${textareaId}-character-limit` : undefined
    const statusId = hasCounter ? `${textareaId}-character-status` : undefined
    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''))
    const localRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
      const form = localRef.current?.form
      const reset = (event: Event) => {
        setTimeout(() => {
          if (!event.defaultPrevented && value === undefined) setInternalValue(localRef.current?.value ?? '')
        })
      }
      form?.addEventListener('reset', reset)
      return () => form?.removeEventListener('reset', reset)
    }, [value])
    const currentLength = String(value ?? internalValue).length
    const remainingCharacters =
      typeof maxLength === 'number' ? maxLength - currentLength : undefined
    const announcementThreshold =
      typeof maxLength === 'number'
        ? Math.min(20, Math.max(5, Math.ceil(maxLength * 0.1)))
        : 0
    const describedBy = [ariaDescribedBy, hintId, descriptionId, limitId, errorId]
      .filter(Boolean)
      .join(' ') || undefined

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setInternalValue(event.target.value)
      onChange?.(event)
    }

    return (
      <div className="flex w-full flex-col">
        <div className={cn('flex items-center gap-[5px]', !hint && 'mb-[5px]')}>
          <label
            className={cn(
              'block text-foreground',
              size === 'l' ? 'text-[19px] leading-7' : 'text-[16px] leading-6',
              disabled && 'text-foreground-muted',
            )}
            htmlFor={textareaId}
          >
            <FieldLabelText size={size} optional={optional} required={required} requiredIndicator={requiredIndicator}>
              {label}
            </FieldLabelText>
          </label>
          {tooltip}
        </div>
        {hint ? (
          <FieldHint className="mb-[5px] text-[16px] leading-6" id={hintId}>
            {hint}
          </FieldHint>
        ) : null}
        <div className="relative flex w-full">
          <textarea
            aria-describedby={describedBy}
            aria-invalid={error ? true : ariaInvalid}
            aria-required={required || undefined}
            className={cn(
              'min-h-[97px] w-full resize-y rounded-[5px] border-2 border-border-strong bg-white px-[15px] pt-2.5 text-foreground outline-none placeholder:text-foreground-muted',
              'hover:ring-[5px] hover:ring-foreground-muted focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
              'disabled:cursor-not-allowed disabled:resize-none disabled:border-border-muted disabled:bg-white disabled:text-foreground-muted disabled:hover:ring-0',
              size === 'l' ? 'text-[19px] leading-7' : 'text-[16px] leading-6',
              hasCounter ? 'pb-8' : 'pb-2.5',
              error && 'border-error pr-12',
              className,
            )}
            defaultValue={value === undefined ? defaultValue : undefined}
            disabled={disabled}
            id={textareaId}
            maxLength={maxLength}
            onChange={handleChange}
            ref={(node) => {
              localRef.current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) ref.current = node
            }}
            required={required}
            rows={rows}
            value={value}
            wrap={wrap}
            {...props}
          />
          {error ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-3 right-4 z-10 text-error"
            >
              <FieldErrorIcon />
            </span>
          ) : null}
          {hasCounter ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[22px] bottom-2 z-10 bg-white px-1 text-[16px] leading-6 text-foreground-muted"
            >
              {currentLength}/{maxLength}
            </span>
          ) : null}
        </div>
        {hasCounter ? (
          <>
            <span className="sr-only" id={limitId}>
              Maximálne {maxLength} znakov
            </span>
            <span aria-atomic="true" aria-live="polite" className="sr-only" id={statusId} role="status">
              {remainingCharacters !== undefined &&
              remainingCharacters <= announcementThreshold
                ? `Zostáva ${remainingCharacters} z ${maxLength} znakov.`
                : ''}
            </span>
          </>
        ) : null}
        {description ? (
          <FieldHint className="mt-[5px] text-[16px] leading-6" id={descriptionId}>
            {description}
          </FieldHint>
        ) : null}
        {error ? (
          <FieldError className="mt-[5px] text-[16px] leading-6" id={errorId}>
            {error}
          </FieldError>
        ) : null}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
