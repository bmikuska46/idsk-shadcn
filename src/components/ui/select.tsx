'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { forwardRef, useId, useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { FieldError, FieldErrorIcon, FieldHint, FieldLabelText, type RequiredIndicator } from '@/components/ui/field'
import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

const subscribe = () => () => {}

export type SelectOption = {
  disabled?: boolean
  label: string
  value: string
}

export type SelectProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'defaultValue' | 'onChange' | 'value'
> & {
  'aria-describedby'?: string
  autoComplete?: string
  containerClassName?: string
  defaultValue?: string
  error?: string
  form?: string
  hint?: string
  label: string
  name?: string
  onValueChange?: (value: string) => void
  optional?: boolean
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  /** Show the mandatory marker as a red asterisk (default) or as "(povinné pole)". */
  requiredIndicator?: RequiredIndicator
  /** IDSK size: L 48px or M 40px. `s` is a deprecated alias of `m`. */
  size?: 'm' | 'l' | 's'
  /** Tooltip mark rendered after the label, see `InfoTooltip`. */
  tooltip?: ReactNode
  value?: string
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      autoComplete,
      className,
      containerClassName,
      defaultValue,
      disabled,
      error,
      form,
      hint,
      id,
      label,
      name,
      onValueChange,
      optional = false,
      options,
      placeholder = 'Vyberte možnosť',
      required = false,
      requiredIndicator,
      size = 'l',
      tooltip,
      value,
      ...triggerProps
    },
    ref,
  ) => {
    const enhanced = useSyncExternalStore(subscribe, () => true, () => false)
    const generatedId = useId()
    const selectId = id ?? `select-${generatedId.replace(/:/g, '')}`
    const labelId = `${selectId}-label`
    const hintId = hint ? `${selectId}-hint` : undefined
    const errorId = error ? `${selectId}-error` : undefined
    const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined
    const isLarge = size === 'l'

    return (
      <div className={cn('flex w-full flex-col', containerClassName)}>
        <div className={cn('flex items-center gap-[5px]', !hint && 'mb-[5px]')}>
          <label
            className={cn(
              'block text-foreground',
              isLarge ? 'text-[19px] leading-7' : 'text-[16px] leading-6',
              disabled && 'text-foreground-muted',
            )}
            htmlFor={selectId}
            id={labelId}
          >
            <FieldLabelText size={isLarge ? 'l' : 'm'} optional={optional} required={required} requiredIndicator={requiredIndicator}>
              {label}
            </FieldLabelText>
          </label>
          {tooltip}
        </div>

        {hint ? (
          <FieldHint className={cn('mb-[5px]', !isLarge && 'text-[16px] leading-6')} id={hintId}>
            {hint}
          </FieldHint>
        ) : null}

        {!enhanced ? (
          <select
            aria-describedby={describedBy}
            aria-invalid={error ? true : ariaInvalid}
            autoComplete={autoComplete}
            className={cn('w-full rounded-[5px] border-2 border-border-strong bg-white px-[15px] tracking-[0.5px] focus:outline-3 focus:outline-focus', isLarge ? 'h-12 text-[19px] leading-7' : 'h-10 text-[16px] leading-6', className)}
            defaultValue={value ?? defaultValue ?? ''}
            disabled={disabled}
            form={form}
            id={selectId}
            name={name}
            required={required}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => <option disabled={option.disabled} key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : <SelectPrimitive.Root
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          disabled={disabled}
          form={form}
          name={name}
          onValueChange={onValueChange}
          required={required}
          value={value}
        >
          <div className="relative w-full">
            <SelectPrimitive.Trigger
              {...triggerProps}
              aria-describedby={describedBy}
              aria-errormessage={errorId ?? triggerProps['aria-errormessage']}
              aria-invalid={error ? true : ariaInvalid}
              aria-labelledby={triggerProps['aria-labelledby'] ?? `${labelId} ${selectId}`}
              aria-required={required || undefined}
              className={cn(
                'tracking-[0.5px] relative flex w-full items-center rounded-[5px] border-2 bg-white text-left outline-none transition-[box-shadow,border-color]',
                'cursor-pointer border-border-strong hover:ring-[5px] hover:ring-foreground-muted',
                'focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
                'disabled:cursor-not-allowed disabled:border-border-muted disabled:bg-white disabled:text-foreground-muted disabled:hover:ring-0',
                'data-[placeholder]:text-foreground-muted data-[state=open]:[&_[data-chevron]]:rotate-180',
                isLarge
                  ? 'h-12 py-2 pr-12 pl-[15px] text-[19px] leading-7'
                  : 'h-10 py-1.5 pr-12 pl-[15px] text-[16px] leading-6',
                error && 'border-error pr-[75px]',
                className,
              )}
              id={selectId}
              ref={ref}
            >
              <span className="block min-w-0 flex-1 truncate">
                <SelectPrimitive.Value placeholder={placeholder} />
              </span>
              {error ? (
                <FieldErrorIcon className="pointer-events-none absolute top-1/2 right-[45px] -translate-y-1/2 text-error" />
              ) : null}
              <SelectPrimitive.Icon asChild>
                <MaterialIcon name="expandMore"
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transition-transform',
                    disabled ? 'text-foreground-muted' : 'text-foreground',
                  )}
                  data-chevron=""
                />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[5px] border-2 border-border bg-white shadow-idsk-md"
                position="popper"
                sideOffset={5}
              >
                <SelectPrimitive.ScrollUpButton className="flex h-10 items-center justify-center bg-white text-foreground">
                  <MaterialIcon name="expandLess" aria-hidden="true" className="h-5 w-5" />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="max-h-[300px]">
                  {options.map((option) => (
                    <SelectPrimitive.Item
                      className={cn(
                        'relative flex min-h-12 w-full cursor-pointer items-center border-l-4 border-transparent py-2.5 pr-5 pl-4 text-left text-[16px] leading-6 text-foreground outline-none',
                        'data-[highlighted]:bg-surface-muted data-[highlighted]:underline',
                        'data-[state=checked]:border-primary-dark data-[state=checked]:font-bold data-[state=checked]:text-link',
                        'data-[disabled]:cursor-not-allowed data-[disabled]:text-foreground-muted',
                      )}
                      disabled={option.disabled}
                      key={option.value}
                      value={option.value}
                    >
                      <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex h-10 items-center justify-center bg-white text-foreground">
                  <MaterialIcon name="expandMore" aria-hidden="true" className="h-5 w-5" />
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </div>
        </SelectPrimitive.Root>}

        {error ? (
          <FieldError className={cn('mt-[5px]', !isLarge && 'text-[16px] leading-6')} id={errorId}>
            {error}
          </FieldError>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
