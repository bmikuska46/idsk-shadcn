import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type CheckboxItem = {
  label: ReactNode
  value: string
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  required?: boolean
  optional?: boolean
  /** Displays Radix's native mixed/indeterminate checkbox state. */
  indeterminate?: boolean
  id?: string
  name?: string
}

export type CheckboxGroupProps = {
  className?: string
  hint?: ReactNode
  error?: ReactNode
  items: CheckboxItem[]
  label?: ReactNode
  name?: string
  disabled?: boolean
  required?: boolean
  onValuesChange?: (values: string[]) => void
  size?: 's' | 'l'
  /** Controlled selected values. */
  values?: string[]
  /** Initial values for uncontrolled usage. */
  defaultValues?: string[]
}

export function CheckboxGroup({
  className,
  hint,
  error,
  items,
  label,
  name,
  disabled = false,
  required = false,
  onValuesChange,
  size = 'l',
  values,
  defaultValues = [],
}: CheckboxGroupProps) {
  const generatedId = useId()
  const hintId = hint ? `${generatedId}-hint` : undefined
  const groupErrorId = error ? `${generatedId}-error` : undefined
  const [internalValues, setInternalValues] = useState(defaultValues)
  const selectedValues = values ?? internalValues

  const updateValues = (nextValues: string[]) => {
    if (values === undefined) setInternalValues(nextValues)
    onValuesChange?.(nextValues)
  }

  return (
    <fieldset
      aria-describedby={[hintId, groupErrorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
      className={cn('flex min-w-0 flex-col', className)}
      disabled={disabled}
    >
      {label ? (
        <legend className="mb-1 text-[19px] leading-7 text-[#212121]">
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-[#C3112B]">
              *
            </span>
          ) : null}
        </legend>
      ) : null}
      {hint ? (
        <p className="mb-3 text-[19px] leading-7 text-[#757575]" id={hintId}>
          {hint}
        </p>
      ) : null}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => {
          const itemId = item.id ?? `${generatedId}-${index}`
          const itemHintId = item.hint ? `${itemId}-hint` : undefined
          const itemError = item.error
          const itemErrorId = itemError ? `${itemId}-error` : undefined
          const itemLabelId = `${itemId}-label`
          const describedBy = [hintId, itemHintId, itemErrorId, groupErrorId]
            .filter(Boolean)
            .join(' ') || undefined
          const isDisabled = disabled || item.disabled
          const isItemRequired = item.required === true
          const isNativeRequired =
            isItemRequired || (required && selectedValues.length === 0 && index === 0)
          const isChecked = selectedValues.includes(item.value)
          const checked = item.indeterminate ? 'indeterminate' : isChecked
          const hasError = Boolean(error || itemError)

          return (
            <div className="flex flex-col" key={item.value}>
              <label
                className={cn(
                  'group relative inline-flex w-fit max-w-full self-start items-start rounded-[5px]',
                  'focus-within:outline-solid focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-[#D96E00]',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
                htmlFor={itemId}
              >
                <CheckboxPrimitive.Root
                  aria-describedby={describedBy}
                  aria-invalid={hasError || undefined}
                  aria-labelledby={itemLabelId}
                  aria-required={isNativeRequired || undefined}
                  checked={checked}
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-[5px] border-2 bg-white text-[#424242] outline-none focus:outline-none focus-visible:outline-none',
                    !isDisabled && 'group-hover:ring-4 group-hover:ring-[#757575]',
                    'disabled:cursor-not-allowed disabled:border-[#BDBDBD]',
                    size === 'l' ? 'h-10 w-10' : 'h-6 w-6',
                    hasError ? 'border-[#C3112B]' : 'border-[#424242]',
                  )}
                  disabled={isDisabled}
                  id={itemId}
                  name={item.name ?? name}
                  onCheckedChange={(nextChecked) => {
                    const nextValues =
                      nextChecked === true
                        ? Array.from(new Set([...selectedValues, item.value]))
                        : selectedValues.filter((value) => value !== item.value)

                    updateValues(nextValues)
                  }}
                  required={isNativeRequired}
                  value={item.value}
                >
                  <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                    {checked === 'indeterminate' ? (
                      <Minus
                        aria-hidden="true"
                        className={size === 'l' ? 'h-5 w-5' : 'h-3 w-3'}
                        strokeWidth={3}
                      />
                    ) : (
                      <Check
                        aria-hidden="true"
                        className={size === 'l' ? 'h-5 w-5' : 'h-3 w-3'}
                        strokeWidth={3}
                      />
                    )}
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                <span
                  className={cn(
                    'ml-3 text-[19px] leading-7',
                    isDisabled ? 'text-[#757575]' : 'text-black',
                  )}
                  id={itemLabelId}
                >
                  {item.label}
                  {isItemRequired ? (
                    <span aria-hidden="true" className="ml-1 text-[#C3112B]">
                      *
                    </span>
                  ) : item.optional ? (
                    <span className="ml-1 text-[16px] leading-6 text-[#757575]">
                      nepovinné pole
                    </span>
                  ) : null}
                </span>
              </label>
              {item.hint ? (
                <span
                  className={cn(
                    'mt-1 text-[19px] leading-7 text-[#757575]',
                    size === 'l' ? 'ml-[52px]' : 'ml-9',
                  )}
                  id={itemHintId}
                >
                  {item.hint}
                </span>
              ) : null}
              {itemError ? (
                <span className="mt-2 text-[19px] leading-7 text-[#C3112B]" id={itemErrorId}>
                  <span>Chyba: </span>
                  {itemError}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      {error ? (
        <p className="mt-2 text-[19px] leading-7 text-[#C3112B]" id={groupErrorId}>
          <span>Chyba: </span>
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
