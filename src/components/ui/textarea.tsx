'use client'

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'

import { cn } from '@/lib/utils'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode
  /** Supporting text displayed between the label and the textarea. */
  hint?: ReactNode
  /** Supporting text displayed below the textarea. */
  description?: ReactNode
  error?: ReactNode
  optional?: boolean
  counter?: boolean
}

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M12 2 1 21h22L12 2Zm1 16h-2v-2h2v2Zm0-4h-2V9h2v5Z" />
    </svg>
  )
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
      disabled,
      maxLength,
      counter = true,
      onChange,
      defaultValue,
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
        <label
          className={cn(
            'mb-1 flex flex-col text-[19px] leading-7 text-[#212121]',
            disabled && 'text-[#757575]',
          )}
          htmlFor={textareaId}
        >
          <span>
            {label}
            {required ? (
              <span aria-hidden="true" className="ml-1 text-[#C3112B]">
                *
              </span>
            ) : optional ? (
              <span
                className="ml-1 text-[16px] leading-6 font-normal text-[#757575]"
              >
                (nepovinné pole)
              </span>
            ) : null}
          </span>
        </label>
        {hint ? (
          <span className="mb-2 text-[19px] leading-7 text-[#757575]" id={hintId}>
            {hint}
          </span>
        ) : null}
        <div className="relative flex w-full">
          <textarea
            aria-describedby={describedBy}
            aria-invalid={error ? true : ariaInvalid}
            aria-required={required || undefined}
            className={cn(
              'min-h-[88px] w-full resize-y rounded-[5px] border-2 border-[#424242] bg-white px-4 pt-2.5 text-[19px] leading-7 text-[#212121] outline-none placeholder:text-[#757575]',
              'hover:ring-4 hover:ring-[#757575] focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-[#D96E00]',
              'disabled:cursor-not-allowed disabled:resize-none disabled:border-[#BDBDBD] disabled:bg-[#F5F5F5] disabled:text-[#757575] disabled:hover:ring-0',
              hasCounter ? 'pb-8' : 'pb-2.5',
              error && 'border-[#C3112B] pr-12',
              className,
            )}
            defaultValue={value === undefined ? defaultValue : undefined}
            disabled={disabled}
            id={textareaId}
            maxLength={maxLength}
            onChange={handleChange}
            ref={ref}
            required={required}
            rows={rows}
            value={value}
            wrap={wrap}
            {...props}
          />
          {error ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-3 right-4 z-10 text-[#C3112B]"
            >
              <ErrorIcon />
            </span>
          ) : null}
          {hasCounter ? (
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute right-4 bottom-2 z-10 px-1 text-[16px] leading-6 text-[#757575]',
                disabled ? 'bg-[#F5F5F5]' : 'bg-white',
              )}
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
          <span className="mt-2 text-[16px] leading-6 text-[#757575]" id={descriptionId}>
            {description}
          </span>
        ) : null}
        {error ? (
          <span className="mt-2 text-[19px] leading-7 text-[#C3112B]" id={errorId}>
            <span>Chyba: </span>
            {error}
          </span>
        ) : null}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
