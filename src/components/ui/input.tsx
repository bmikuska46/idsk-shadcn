import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type InputSize = 's' | 'm' | 'l'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: ReactNode
  /** Supporting text displayed between the label and the input. */
  hint?: ReactNode
  /** Supporting text displayed below the input. */
  description?: ReactNode
  error?: ReactNode
  optional?: boolean
  /** IDSK visual size. `small` is kept as a backwards-compatible alias for `s`. */
  size?: InputSize
  small?: boolean
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
      size = 'l',
      small,
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
    const resolvedSize = small ? 's' : size

    return (
      <div className="flex w-full flex-col">
        <label
          className={cn(
            'mb-1 flex flex-col text-[19px] leading-7 text-[#212121]',
            disabled && 'text-[#757575]',
          )}
          htmlFor={inputId}
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
          <input
            aria-describedby={describedBy}
            aria-invalid={error ? true : ariaInvalid}
            aria-required={required || undefined}
            className={cn(
              'w-full rounded-[5px] border-2 border-[#424242] bg-white px-4 text-[#212121] outline-none transition-colors placeholder:text-[#757575]',
              'hover:ring-4 hover:ring-[#757575] focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-[#D96E00]',
              'disabled:cursor-not-allowed disabled:border-[#BDBDBD] disabled:bg-[#F5F5F5] disabled:text-[#757575] disabled:hover:ring-0',
              resolvedSize === 'l'
                ? 'h-12 text-[19px] leading-7'
                : 'h-10 text-[16px] leading-6',
              error && 'border-[#C3112B] pr-12',
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
              className="pointer-events-none absolute top-1/2 right-4 z-10 -translate-y-1/2 text-[#C3112B]"
            >
              <ErrorIcon />
            </span>
          ) : null}
        </div>
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

Input.displayName = 'Input'
