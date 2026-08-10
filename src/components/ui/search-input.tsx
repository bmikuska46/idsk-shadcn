import { Search } from 'lucide-react'
import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from 'react'

import { cn } from '@/lib/utils'

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  buttonAriaLabel?: string
  buttonClassName?: string
  className?: string
  disableSubmitWhenEmpty?: boolean
  fullWidth?: boolean
  inputClassName?: string
  label?: string
  onSearch?: (value: string) => void
  size?: 'medium' | 'large'
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      buttonAriaLabel = 'Vyhľadať',
      buttonClassName,
      className,
      defaultValue,
      disableSubmitWhenEmpty = true,
      disabled,
      fullWidth = true,
      id,
      inputClassName,
      label = 'Vyhľadať',
      onChange,
      onSearch,
      size = 'medium',
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(() =>
      typeof defaultValue === 'string' ? defaultValue : defaultValue?.toString() ?? '',
    )

    const currentValue = isControlled ? value?.toString() ?? '' : internalValue
    const isSubmitDisabled =
      disabled || (disableSubmitWhenEmpty && currentValue.trim().length === 0)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value)
      }

      onChange?.(event)
    }

    return (
      <form
        className={cn(
          'group flex rounded-[8px] focus-within:outline focus-within:outline-3 focus-within:outline-offset-[2px] focus-within:outline-focus hover:shadow-[0_0_0_3px_var(--foreground-muted)]',
          fullWidth ? 'w-full' : 'w-fit',
          className,
        )}
        onSubmit={(event) => {
          event.preventDefault()

          if (isSubmitDisabled) {
            return
          }

          onSearch?.(currentValue.trim())
        }}
        role="search"
      >
        <label className="sr-only" htmlFor={inputId}>
          {label}
        </label>
        <div
          className={cn(
            'relative flex grow rounded-l-[8px] rounded-r-none border-2 border-r-0 border-border-strong bg-white',
          )}
        >
          <input
            className={cn(
              'w-full rounded-l-[8px] rounded-r-none bg-white px-4 text-foreground-soft placeholder:text-foreground-muted outline-none focus:outline-none focus-visible:outline-none',
              'disabled:border-border disabled:text-foreground-muted disabled:placeholder:text-foreground-muted',
              size === 'large'
                ? 'h-12 text-xl leading-8'
                : 'h-10 text-base leading-6',
              inputClassName,
            )}
            disabled={disabled}
            id={inputId}
            onChange={handleChange}
            ref={ref}
            type="search"
            value={currentValue}
            {...props}
          />
        </div>
        <button
          aria-label={buttonAriaLabel}
          className={cn(
            'flex shrink-0 self-stretch items-center justify-center rounded-r-[8px] rounded-l-none bg-primary text-white outline-none transition-colors focus:outline-none focus-visible:outline-none active:bg-primary-dark',
            'hover:bg-primary/90 disabled:bg-disabled',
            size === 'large' ? 'w-[3.25rem]' : 'w-12',
            buttonClassName,
          )}
          disabled={isSubmitDisabled}
          type="submit"
        >
          <Search
            aria-hidden="true"
            className={size === 'large' ? 'h-8 w-8' : 'h-5 w-5'}
          />
        </button>
      </form>
    )
  },
)

SearchInput.displayName = 'SearchInput'
