'use client'

import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cloneElement, forwardRef, isValidElement, type DOMAttributes, type SyntheticEvent, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * IDSK button. Types: Primary, Secondary, Tertiary (`text`) and Tertiary
 * without horizontal padding (`text-inline`). Colour schemes: basic, success, error and
 * white (tertiary only). Sizes L 49px, M 41px and S 35px with 10px horizontal
 * padding, 5px gap between icon and label. Hover only underlines the label,
 * focus shows the 3px orange outline, disabled is N600.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[5px] rounded-[5px] px-[10px] text-center tracking-[0.5px] text-[16px] leading-6 font-bold outline-none transition-colors duration-100 focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed aria-disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'border-0 text-white hover:underline active:underline disabled:bg-disabled disabled:text-white disabled:no-underline disabled:hover:no-underline aria-disabled:bg-disabled aria-disabled:text-white aria-disabled:no-underline',
        secondary:
          'border-2 bg-white hover:underline active:underline disabled:border-disabled disabled:bg-white disabled:text-disabled disabled:no-underline disabled:hover:no-underline aria-disabled:border-disabled aria-disabled:bg-white aria-disabled:text-disabled aria-disabled:no-underline',
        text: 'border-0 bg-transparent underline hover:decoration-[3px] active:decoration-[3px] disabled:text-disabled disabled:decoration-1 disabled:hover:decoration-1 aria-disabled:text-disabled aria-disabled:decoration-1',
        'text-inline':
          'border-0 bg-transparent px-0 underline hover:decoration-[3px] active:decoration-[3px] disabled:text-disabled disabled:decoration-1 disabled:hover:decoration-1 aria-disabled:text-disabled aria-disabled:decoration-1',
      },
      tone: {
        basic: '',
        success: '',
        error: '',
        /** @deprecated Use `error`; kept as an alias of the Figma "Error" scheme. */
        warning: '',
        /** Tertiary on dark backgrounds only. */
        white: '',
      },
      size: {
        lg: 'h-[49px]',
        md: 'h-[41px]',
        sm: 'h-[35px]',
      },
      fullWidth: {
        true: 'w-full sm:w-auto',
        false: 'w-auto',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        tone: ['basic', 'white'],
        className: 'bg-primary active:bg-primary-dark disabled:active:bg-disabled',
      },
      {
        variant: 'primary',
        tone: 'success',
        className: 'bg-success active:bg-success-dark disabled:active:bg-disabled',
      },
      {
        variant: 'primary',
        tone: ['error', 'warning'],
        className: 'bg-error active:bg-error-dark disabled:active:bg-disabled',
      },
      {
        variant: 'secondary',
        tone: ['basic', 'white'],
        className: 'border-link text-link active:bg-surface-primary disabled:active:bg-white',
      },
      {
        variant: 'secondary',
        tone: 'success',
        className: 'border-success text-success active:bg-surface-success disabled:active:bg-white',
      },
      {
        variant: 'secondary',
        tone: ['error', 'warning'],
        className: 'border-error text-error active:bg-surface-error disabled:active:bg-white',
      },
      {
        variant: ['text', 'text-inline'],
        tone: 'basic',
        className: 'text-link active:bg-surface-primary disabled:active:bg-transparent',
      },
      {
        variant: ['text', 'text-inline'],
        tone: 'success',
        className: 'text-success active:bg-surface-success disabled:active:bg-transparent',
      },
      {
        variant: ['text', 'text-inline'],
        tone: ['error', 'warning'],
        className: 'text-error active:bg-surface-error disabled:active:bg-transparent',
      },
      {
        variant: ['text', 'text-inline'],
        tone: 'white',
        className: 'text-white active:bg-surface-primary active:text-link focus-visible:outline-focus-inverse disabled:active:bg-transparent disabled:active:text-disabled',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'basic',
      size: 'lg',
      fullWidth: false,
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      children,
      leadingIcon,
      trailingIcon,
      variant,
      tone,
      size,
      fullWidth,
      onClick,
      type,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const childAriaDisabled =
      asChild && isValidElement<{ 'aria-disabled'?: boolean | 'true' | 'false' }>(children)
        ? children.props['aria-disabled']
        : undefined
    const ariaDisabled =
      props.disabled ||
      props['aria-disabled'] === true ||
      props['aria-disabled'] === 'true' ||
      childAriaDisabled === true ||
      childAriaDisabled === 'true'

    const blockActivation = (event: SyntheticEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    const blockKey: DOMAttributes<HTMLElement>['onKeyDown'] = (event) => {
      if (event.key === 'Enter' || event.key === ' ') blockActivation(event)
    }
    const content = asChild && ariaDisabled && isValidElement<DOMAttributes<HTMLElement>>(children)
      ? cloneElement(children, {
          onClick: blockActivation,
          onClickCapture: blockActivation,
          onKeyDown: blockKey,
          onKeyDownCapture: blockKey,
          onPointerDown: blockActivation,
          onPointerDownCapture: blockActivation,
        })
      : children

    return (
      <Comp
        className={cn(buttonVariants({ variant, tone, size, fullWidth }), className)}
        onClick={(event) => {
          if (ariaDisabled) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
        ref={ref}
        type={asChild ? undefined : (type ?? 'button')}
        {...props}
        aria-disabled={ariaDisabled || undefined}
        onClickCapture={ariaDisabled ? blockActivation : props.onClickCapture}
        onKeyDownCapture={ariaDisabled ? blockKey : props.onKeyDownCapture}
        onPointerDownCapture={ariaDisabled ? blockActivation : props.onPointerDownCapture}
      >
        {leadingIcon ? <span className="inline-flex shrink-0 [&>svg]:size-[25px]">{leadingIcon}</span> : null}
        <Slottable>{content}</Slottable>
        {trailingIcon ? <span className="inline-flex shrink-0 [&>svg]:size-[25px]">{trailingIcon}</span> : null}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { buttonVariants }
