'use client'

import { useId, type ChangeEvent, type FieldsetHTMLAttributes, type ReactNode } from 'react'

import { FieldError, FieldHint, FieldLabelText, type RequiredIndicator } from '@/components/ui/field'
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
  /** Show the mandatory marker as a red asterisk (default) or as "(povinné pole)". */
  requiredIndicator?: RequiredIndicator
  /** IDSK size: L is a 40px circle with 19px label, S is a 24px circle with 16px label. */
  size?: 's' | 'l'
  /** Tooltip mark rendered after the group label, see `InfoTooltip`. */
  tooltip?: ReactNode
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
  requiredIndicator,
  size = 'l',
  tooltip,
  value,
  ...props
}: IdskRadioGroupProps) {
  const generatedId = useId()
  const groupId = id ?? `radio-group-${generatedId.replace(/:/g, '')}`
  const hintId = hint ? `${groupId}-hint` : undefined
  const errorId = error ? `${groupId}-error` : undefined
  const describedBy = [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined
  const legendTextId = label && tooltip ? `${groupId}-legend` : undefined
  const isLarge = size === 'l'

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(event.currentTarget.value)
  }

  return (
    <fieldset
      aria-errormessage={errorId}
      aria-labelledby={legendTextId}
      className={cn('flex flex-col', className)}
      disabled={disabled}
      id={groupId}
      {...props}
      aria-describedby={describedBy}
      aria-invalid={error ? true : props['aria-invalid']}
    >
      {label ? (
        <legend className={cn('text-[19px] leading-7 text-foreground', !hint && 'mb-[5px]')}>
          <FieldLabelText
            optional={optional}
            required={required}
            requiredIndicator={requiredIndicator}
            textId={legendTextId}
            tooltip={tooltip}
          >
            {label}
          </FieldLabelText>
        </legend>
      ) : null}

      {hint ? (
        <FieldHint className="mb-[5px]" id={hintId}>
          {hint}
        </FieldHint>
      ) : null}

      <div
        className={cn(
          inline ? 'flex flex-wrap gap-x-[30px]' : 'flex flex-col',
          isLarge ? 'gap-y-[10px]' : 'gap-y-[5px]',
        )}
      >
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
                  'group relative flex w-fit max-w-full min-w-0 items-center',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
                htmlFor={itemId}
              >
                <input
                  {...checkedProps}
                  aria-describedby={[itemHintId, errorId].filter(Boolean).join(' ') || undefined}
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
                    'flex shrink-0 items-center justify-center rounded-full border-2 bg-white transition-[box-shadow] duration-100',
                    'peer-focus-visible:outline-solid peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
                    'peer-checked:[&>span]:scale-100 peer-checked:[&>span]:opacity-100',
                    !isDisabled && 'group-hover:ring-[5px] group-hover:ring-foreground-muted',
                    isLarge ? 'h-10 w-10' : 'h-6 w-6',
                    error ? 'border-error' : 'border-black',
                    isDisabled && !error && 'border-border-muted [&>span]:bg-foreground-muted',
                  )}
                >
                  <span
                    className={cn(
                      'scale-50 rounded-full bg-black opacity-0 transition-all duration-100',
                      isLarge ? 'h-5 w-5' : 'h-3 w-3',
                    )}
                  />
                </span>
                <span
                  className={cn(
                    'ml-[10px] min-w-0',
                    isLarge ? 'text-[19px] leading-7' : 'text-[16px] leading-6',
                    isDisabled ? 'text-foreground-muted' : 'text-foreground',
                  )}
                >
                  {item.label}
                </span>
              </label>
              {item.hint ? (
                <FieldHint
                  className={cn('mt-[5px]', isLarge ? 'ml-[50px]' : 'ml-[34px] text-[16px] leading-6')}
                  id={itemHintId}
                >
                  {item.hint}
                </FieldHint>
              ) : null}
            </div>
          )
        })}
      </div>

      {error ? (
        <FieldError className="mt-[5px]" id={errorId}>
          {error}
        </FieldError>
      ) : null}
    </fieldset>
  )
}

/** Shadcn-style alias while preserving the original public component name. */
export const RadioGroup = IdskRadioGroup
