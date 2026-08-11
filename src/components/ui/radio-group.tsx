'use client'

import { useId, type ChangeEvent, type FieldsetHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type RadioItem = {
  disabled?: boolean
  hint?: string
  label: string
  value: string
}

export type IdskRadioGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange'
> & {
  defaultValue?: string
  disabled?: boolean
  error?: string
  hint?: string
  inline?: boolean
  items: RadioItem[]
  label?: string
  name: string
  onValueChange?: (value: string) => void
  optional?: boolean
  required?: boolean
  size?: 's' | 'l'
  value?: string
}

export function IdskRadioGroup({
  className,
  defaultValue,
  disabled = false,
  error,
  hint,
  id,
  inline = false,
  items,
  label,
  name,
  onValueChange,
  optional = false,
  required = false,
  size = 'l',
  value,
  ...props
}: IdskRadioGroupProps) {
  const generatedId = useId()
  const groupId = id ?? `radio-group-${generatedId.replace(/:/g, '')}`
  const hintId = hint ? `${groupId}-hint` : undefined
  const errorId = error ? `${groupId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(event.currentTarget.value)
  }

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-errormessage={errorId}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      className={cn('flex flex-col', className)}
      disabled={disabled}
      id={groupId}
      {...props}
    >
      {label ? (
        <legend className="mb-[3px] text-[24px] leading-[35px] font-bold text-foreground">
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-warning">
              *
            </span>
          ) : optional ? (
            <span
              className="ml-1 text-[16px] leading-6 font-normal text-foreground-muted"
            >
              (nepovinné pole)
            </span>
          ) : null}
        </legend>
      ) : null}

      {hint ? (
        <div className="mb-7 text-[19px] leading-7 text-foreground-muted" id={hintId}>
          {hint}
        </div>
      ) : null}

      <div className={cn('gap-4', inline ? 'flex flex-wrap' : 'flex flex-col')}>
        {items.map((item, index) => {
          const itemId = `${groupId}-${index}`
          const itemHintId = item.hint ? `${itemId}-hint` : undefined
          const isDisabled = disabled || item.disabled
          const checkedProps =
            value === undefined
              ? { defaultChecked: defaultValue === item.value }
              : { checked: value === item.value }

          return (
            <div className="flex flex-col" key={item.value}>
              <label
                className={cn(
                  'group relative flex items-center',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
                htmlFor={itemId}
              >
                <input
                  {...checkedProps}
                  aria-describedby={
                    [hintId, itemHintId, errorId].filter(Boolean).join(' ') || undefined
                  }
                  aria-invalid={error ? true : undefined}
                  className="peer sr-only"
                  disabled={isDisabled}
                  id={itemId}
                  name={name}
                  onChange={handleChange}
                  required={required}
                  type="radio"
                  value={item.value}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-full border-2 bg-white',
                    'peer-focus-visible:outline-solid peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
                    'peer-checked:[&>span]:scale-100 peer-checked:[&>span]:opacity-100',
                    !isDisabled && 'group-hover:ring-[4px] group-hover:ring-foreground-muted',
                    size === 'l' ? 'h-10 w-10' : 'h-6 w-6',
                    error ? 'border-warning' : 'border-foreground-soft',
                    isDisabled && !error && 'border-border',
                  )}
                >
                  <span
                    className={cn(
                      'scale-50 rounded-full bg-foreground-soft opacity-0 transition-all duration-100',
                      size === 'l' ? 'h-5 w-5' : 'h-3 w-3',
                    )}
                  />
                </span>
                <span
                  className={cn(
                    'ml-3 text-[19px] leading-7',
                    isDisabled ? 'text-foreground-muted' : 'text-foreground',
                  )}
                >
                  {item.label}
                </span>
              </label>
              {item.hint ? (
                <div
                  className={cn(
                    'mt-1 text-[19px] leading-7 text-foreground-muted',
                    size === 'l' ? 'ml-[52px]' : 'ml-9',
                  )}
                  id={itemHintId}
                >
                  {item.hint}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {error ? (
        <div className="mt-4 flex items-start" id={errorId}>
          <span className="text-[19px] leading-7 text-warning">
            <span>Chyba: </span>
            {error}
          </span>
        </div>
      ) : null}
    </fieldset>
  )
}

/** Shadcn-style alias while preserving the original public component name. */
export const RadioGroup = IdskRadioGroup
