'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { forwardRef, useId, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export type SelectOption = {
  disabled?: boolean
  label: string
  value: string
}

export type SelectProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'defaultValue' | 'onChange' | 'value'
> & {
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
  size?: 's' | 'l'
  value?: string
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
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
      size = 'l',
      value,
      ...triggerProps
    },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? `select-${generatedId.replace(/:/g, '')}`
    const labelId = `${selectId}-label`
    const hintId = hint ? `${selectId}-hint` : undefined
    const errorId = error ? `${selectId}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className={cn('flex w-full flex-col', containerClassName)}>
        <label
          className="mb-1 block text-[19px] leading-7 text-foreground"
          htmlFor={selectId}
          id={labelId}
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-xl text-warning">
              *
            </span>
          ) : optional ? (
            <span className="ml-1 text-[16px] leading-6 text-foreground-muted">
              (nepovinné pole)
            </span>
          ) : null}
        </label>

        {hint ? (
          <div className="mb-2 text-[19px] leading-7 text-foreground-muted" id={hintId}>
            {hint}
          </div>
        ) : null}

        <SelectPrimitive.Root
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
              aria-errormessage={errorId}
              aria-invalid={error ? true : undefined}
              aria-labelledby={labelId}
              aria-required={required || undefined}
              className={cn(
                'relative flex w-full items-center rounded-[5px] border-2 bg-white text-left tracking-wide outline-none transition-colors',
                'cursor-pointer border-foreground-soft hover:ring-[4px] hover:ring-foreground-muted',
                'focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
                'disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:text-foreground-muted disabled:hover:ring-0',
                'data-[placeholder]:text-foreground-muted data-[state=open]:[&_[data-chevron]]:rotate-180',
                size === 'l'
                  ? 'min-h-12 py-2.5 pr-12 pl-5 text-[19px] leading-7'
                  : 'min-h-10 py-2 pr-12 pl-4 text-[16px] leading-6',
                error && 'border-warning pr-[75px]',
                className,
              )}
              id={selectId}
              ref={ref}
            >
              <span className="block min-w-0 flex-1 truncate">
                <SelectPrimitive.Value placeholder={placeholder} />
              </span>
              {error ? (
                <AlertTriangle
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-[45px] h-5 w-5 -translate-y-1/2 text-warning"
                />
              ) : null}
              <SelectPrimitive.Icon asChild>
                <ChevronDown
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
                className={cn(
                  'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[5px] border-2 border-border bg-white',
                  'shadow-idsk-md',
                )}
                position="popper"
                sideOffset={5}
              >
                <SelectPrimitive.ScrollUpButton className="flex h-10 items-center justify-center bg-white text-foreground">
                  <ChevronUp aria-hidden="true" className="h-5 w-5" />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="max-h-[300px] rounded-[3px]">
                  {options.map((option) => (
                    <SelectPrimitive.Item
                      className={cn(
                        'relative flex min-h-12 w-full cursor-pointer items-center border-0 px-5 py-2.5 text-left text-[16px] leading-6 tracking-wide text-foreground outline-none',
                        'data-[highlighted]:bg-surface-muted data-[highlighted]:underline data-[highlighted]:decoration-2 data-[highlighted]:underline-offset-2',
                        'data-[state=checked]:bg-surface-primary data-[state=checked]:font-bold',
                        'data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface-muted data-[disabled]:text-foreground-muted',
                      )}
                      disabled={option.disabled}
                      key={option.value}
                      value={option.value}
                    >
                      <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="ml-auto flex h-5 w-5 items-center justify-center text-primary">
                        <Check aria-hidden="true" className="h-5 w-5" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex h-10 items-center justify-center bg-white text-foreground">
                  <ChevronDown aria-hidden="true" className="h-5 w-5" />
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </div>
        </SelectPrimitive.Root>

        {error ? (
          <p className="mt-2 text-[19px] leading-7 text-warning" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
