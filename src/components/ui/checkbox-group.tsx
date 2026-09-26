'use client'

import { useId, useState, useEffect, useRef, type ReactNode } from 'react'

import { FieldError, FieldHint, FieldLabelText, type RequiredIndicator } from '@/components/ui/field'
import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

export type CheckboxItem = {
  label: ReactNode
  value: string
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  required?: boolean
  optional?: boolean
  /** Displays the native mixed/indeterminate checkbox state after hydration. */
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
  /** Show the mandatory marker as a red asterisk (default) or as "(povinné pole)". */
  requiredIndicator?: RequiredIndicator
  onValuesChange?: (values: string[]) => void
  /** IDSK size: L is a 40px box with 19px label, S is a 24px box with 16px label. */
  size?: 's' | 'l'
  /** Tooltip mark rendered after the group label, see `InfoTooltip`. */
  tooltip?: ReactNode
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
  requiredIndicator,
  onValuesChange,
  size = 'l',
  tooltip,
  values,
  defaultValues = [],
}: CheckboxGroupProps) {
  const generatedId = useId()
  const hintId = hint ? `${generatedId}-hint` : undefined
  const groupErrorId = error ? `${generatedId}-error` : undefined
  const [internalValues, setInternalValues] = useState(defaultValues)
  const selectedValues = values ?? internalValues
  const fieldsetRef = useRef<HTMLFieldSetElement>(null)
  useEffect(() => {
    const form = fieldsetRef.current?.form
    const reset = (event: Event) => setTimeout(() => {
      if (!event.defaultPrevented && values === undefined) setInternalValues(defaultValues)
    })
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  }, [values, defaultValues])
  const hasEnabledSelection = items.some((item) => !item.disabled && !item.indeterminate && selectedValues.includes(item.value))
  const firstEnabledIndex = items.findIndex((item) => !item.disabled)
  const isLarge = size === 'l'

  const updateValues = (nextValues: string[]) => {
    if (values === undefined) setInternalValues(nextValues)
    onValuesChange?.(nextValues)
  }

  const legendTextId = label && tooltip ? `${generatedId}-legend` : undefined

  return (
    <fieldset
      aria-describedby={[hintId, groupErrorId].filter(Boolean).join(' ') || undefined}
      aria-labelledby={legendTextId}
      className={cn('flex min-w-0 flex-col', className)}
      disabled={disabled}
      ref={fieldsetRef}
      aria-invalid={error ? true : undefined}
    >
      {label ? (
        <legend className={cn('text-[19px] leading-7 text-foreground', !hint && 'mb-[5px]')}>
          <FieldLabelText
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
      <div className={cn('flex flex-col', isLarge ? 'gap-[10px]' : 'gap-[5px]')}>
        {items.map((item, index) => {
          const itemId = item.id ?? `${generatedId}-${index}`
          const itemHintId = item.hint ? `${itemId}-hint` : undefined
          const itemError = item.error
          const itemErrorId = itemError ? `${itemId}-error` : undefined
          const itemLabelId = `${itemId}-label`
          const describedBy = [itemHintId, itemErrorId].filter(Boolean).join(' ') || undefined
          const isDisabled = disabled || item.disabled
          const isItemRequired = item.required === true
          const isNativeRequired =
            isItemRequired || (required && !hasEnabledSelection && index === firstEnabledIndex)
          const isChecked = selectedValues.includes(item.value)
          const hasError = Boolean(error || itemError)

          return (
            <div className="flex flex-col" key={item.value}>
              <label
                className={cn(
                  'group relative inline-flex w-fit max-w-full items-center self-start rounded-[5px]',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
                htmlFor={itemId}
              >
                <input
                  aria-describedby={describedBy}
                  aria-invalid={hasError || undefined}
                  aria-labelledby={itemLabelId}
                  checked={values !== undefined ? isChecked : undefined}
                  defaultChecked={values === undefined ? defaultValues.includes(item.value) : undefined}
                  className="peer absolute top-0 left-0 z-10 cursor-inherit opacity-0"
                  style={{ width: isLarge ? 40 : 24, height: isLarge ? 40 : 24 }}
                  disabled={isDisabled}
                  id={itemId}
                  name={item.name ?? name}
                  onChange={(event) => {
                    const nextValues = event.currentTarget.checked
                      ? Array.from(new Set([...selectedValues, item.value]))
                      : selectedValues.filter((value) => value !== item.value)
                    updateValues(nextValues)
                  }}
                  ref={(node) => { if (node) node.indeterminate = Boolean(item.indeterminate) }}
                  required={isNativeRequired}
                  type="checkbox"
                  value={item.value}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-[5px] border-2 bg-white text-black',
                    'peer-focus-visible:outline-solid peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
                    'peer-checked:[&_.check]:block peer-indeterminate:[&_.mixed]:block peer-indeterminate:[&_.check]:hidden',
                    !isDisabled && 'group-hover:ring-[5px] group-hover:ring-foreground-muted',
                    isDisabled && 'border-border-muted text-foreground-muted',
                    isLarge ? 'h-10 w-10' : 'h-6 w-6',
                    hasError ? 'border-error' : 'border-black',
                  )}
                >
                  <MaterialIcon name="check" className={cn('check hidden', isLarge ? 'h-6 w-6' : 'h-4 w-4')} />
                  <MaterialIcon name="remove" className={cn('mixed hidden', isLarge ? 'h-6 w-6' : 'h-4 w-4')} />
                </span>
                <span
                  className={cn(
                    'ml-[10px] min-w-0',
                    isLarge ? 'text-[19px] leading-7' : 'text-[16px] leading-6',
                    isDisabled ? 'text-foreground-muted' : 'text-foreground',
                  )}
                  id={itemLabelId}
                >
                  <FieldLabelText optional={item.optional} required={isItemRequired}>
                    {item.label}
                  </FieldLabelText>
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
              {itemError ? (
                <FieldError className="mt-[5px]" id={itemErrorId}>
                  {itemError}
                </FieldError>
              ) : null}
            </div>
          )
        })}
      </div>
      {error ? (
        <FieldError className="mt-[5px]" id={groupErrorId}>
          {error}
        </FieldError>
      ) : null}
    </fieldset>
  )
}
